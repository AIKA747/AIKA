# AIKA

AIKA is a microservices-based SaaS platform built with **Spring Boot** and **Kotlin**, featuring AI-powered content generation, real-time chat, payment processing, recommendation engines, and a React-based admin panel.

**Version:** 0.0.1-SNAPSHOT | **Java:** 17 | **Kotlin:** 1.9.22 | **Spring Boot:** 2.7.7 – 3.1.5

---

## Table of Contents

- [Architecture](#architecture)
- [Services](#services)
  - [Gateway](#1-gateway-service)
  - [Content Service](#2-content-service)
  - [User Service](#3-user-service)
  - [Chat Service](#4-chat-service)
  - [Order Service](#5-order-service)
  - [Bot Service](#6-bot-service)
  - [Admin Service](#7-admin-service)
  - [Admin Panel](#8-admin-panel)
  - [Mobile App](#9-mobile-app-aika-next)
- [Technology Stack](#technology-stack)
- [LLM Providers (Conversational AI Core)](#llm-providers-conversational-ai-core)
- [Database](#database)
- [Message Queue](#message-queue)
- [Caching](#caching)
- [Monitoring & Logging](#monitoring--logging)
- [Security](#security)
- [External Integrations](#external-integrations)
- [Deployment](#deployment)
- [Testing](#testing)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## Architecture

```
  ┌──────────────┐           ┌──────────────┐
  │  Admin Panel │           │  Mobile App  │
  │ (React/UMI)  │           │ (Expo/RN)    │
  └──────┬───────┘           └──────┬───────┘
         │                          │
         └────────────┬─────────────┘
                      │
               ┌──────▼───────┐
               │   Gateway    │◄──── JWT Auth / Sentinel / RBAC
               │  (Port 8080) │
               └──────┬───────┘
                                     │ Spring Cloud Gateway (Reactive)
                 ┌──────────┬────────┼─────────┬──────────┐
                 ▼          ▼        ▼         ▼          ▼
           ┌──────────┐┌────────┐┌───────┐┌────────┐┌────────┐
           │ Content  ││  User  ││ Chat  ││ Order  ││  Bot   │
           │ Service  ││Service ││Service││Service ││Service │
           └────┬─────┘└───┬────┘└──┬────┘└───┬────┘└───┬────┘
                │          │        │         │         │
  ┌─────────────▼──────────▼────────▼─────────▼─────────▼──────────┐
  │                    Shared Infrastructure                        │
  │  MySQL 8.0 │ Redis │ RabbitMQ │ EMQX (MQTT) │ Nacos │ AWS S3  │
  └────────────────────────────────────────────────────────────────┘
                │                                        │
      ┌─────────▼─────────┐                   ┌─────────▼─────────┐
      │  SkyWalking (APM) │                   │  AWS ECR (Images) │
      └───────────────────┘                   └───────────────────┘
```

### Service Communication

| Pattern | Technology | Use Case |
|---------|-----------|----------|
| Synchronous | OpenFeign (REST) | Inter-service API calls |
| Asynchronous | RabbitMQ (AMQP) | Event-driven messaging (user counts, notifications, audit logs) |
| Real-time | MQTT over WebSocket (EMQX) | Chat message delivery |
| Discovery & Config | Alibaba Nacos | Service registration, centralized config, health checks |

### API Endpoint Patterns

| Pattern | Access | Description |
|---------|--------|-------------|
| `/app/**` | Authenticated users | User-facing APIs |
| `/manage/**` | Admin users only | Management APIs |
| `/public/**` | Unauthenticated | Public endpoints |
| `/test/**` | Unauthenticated | Debug/test endpoints |

---

## Services

### 1. Gateway Service

> Spring Cloud Gateway (Reactive) — Port 8080 (staging) / 8081 (production)

The API gateway is the single entry point for all client requests. It handles:

- **JWT Authentication** — Validates tokens from the `Authorization` header, distinguishing between `APPUSER` and `ADMINUSER` types
- **Role-Based Access Control (RBAC)** — Enforces permissions via Redis-cached resource paths per role (`role:resource:paths:{roleId}`)
- **Request Routing** — Routes to downstream microservices via Spring Cloud Gateway predicates
- **Circuit Breaking** — Alibaba Sentinel for fault tolerance and rate limiting
- **Unprotected Paths** — `/*/public/**`, `/*/test/**`, `/chat/emqx/**`
- **Super Admin Bypass** — User ID `1000000` bypasses permission checks

---

### 2. Content Service

> Spring Boot 3.1.5 — Database: `aika_content`

AI-powered content management for stories, posts, and interactive experiences.

**Core Entities:** `Story`, `StoryChapter`, `Post`, `Comment`, `Author`, `Gift`, `Category`, `Thumb` (reactions)

**Key Features:**
- **AI Content Generation** — OpenAI GPT-4o-mini with function calling for structured output; Deepseek for JSON extraction
- **Speech-to-Text** — OpenAI Whisper-1 for audio transcription
- **Content Moderation** — OpenAI Moderation API + dynamic sensitive word lists + blocked author management
- **Distributed Locking** — Redisson 3.23 for concurrent access control
- **API Logging** — All LLM requests logged to `GptReqLog` table

**Endpoints (28+):**

| Path | Description |
|------|-------------|
| `/app/story/**` | Story listing, details, game starts |
| `/app/post/**` | Post feed, creation, interactions |
| `/app/comment/**` | Comment threads |
| `/app/gift/**` | Gift system |
| `/manage/story/**` | Admin story management |
| `/manage/post/**` | Admin content moderation |
| `/manage/category/**` | Category CRUD |

---

### 3. User Service

> Spring Boot 3.1.5 — Database: `aika_user`

User management, multi-provider authentication, media processing, and push notifications.

**Core Entity:** `AppUserInfo` — 35+ fields including profile data, social login payloads, subscription counts, and 8-category interest vectors (sport, entertainment, news, gaming, artistic, lifestyle, technology, social).

**Key Features:**

| Feature | Details |
|---------|---------|
| **Authentication** | Email/password, Google OAuth, Apple Sign-In, Facebook OAuth |
| **Push Notifications** | Firebase Cloud Messaging (FCM) via Firebase Admin SDK v9.2 |
| **Media Processing** | AWS MediaConvert (video transcoding), Rekognition (image/video analysis & moderation) |
| **File Storage** | AWS S3 (SDK v2.20) |
| **Recommendations** | Gorse integration for personalized content |
| **Email** | Spring Boot Mail with verification templates (registration, password reset, email change) |
| **GDPR Compliance** | Data deletion endpoint: `DELETE /public/delete/user/data` |

**Scheduled Jobs (Quartz):**

| Job | Purpose |
|-----|---------|
| `BotPostJob` | Automated bot content posting |
| `DailyJob` | Daily user data aggregation |
| `RekognitionJob` | AWS video analysis polling |
| `InactiveUserCheckJob` | User engagement monitoring |
| `FileClearJob` | Temporary file cleanup |
| `BotUserTaskJob` | Bot task execution |

**Endpoints (25+):**

| Path | Description |
|------|-------------|
| `/app/user/**` | Profile, authentication, search |
| `/app/firebase/bind/**` | FCM token binding |
| `/app/subscription/**` | Subscription management |
| `/manage/user/**` | Admin user management |
| `/manage/push-list/**` | Push notification campaigns |
| `/manage/push-job/**` | Push job scheduling |
| `/public/delete/user/data/**` | Google data deletion compliance |

---

### 4. Chat Service

> Spring Boot 2.7.7 — Protocol: MQTT (Eclipse Paho 1.2.5)

Real-time messaging service using MQTT over WebSocket via EMQX broker.

**MQTT Topics (QoS 1):**
- `chat/bot/topic/{botId}` — Bot incoming messages
- `chat/user/topic/{userId}` — User incoming messages

**EMQX Integration:**
- Connection authentication: `POST /emqx/conn/auth`
- Topic authorization: `POST /emqx/topic/auth`
- JWT validation for MQTT clients
- Per-user topic isolation

**Message Flow:**
```
Client ──WebSocket──► EMQX Broker ──MQTT──► Chat Service
                                              │
                                    ┌─────────┼──────────┐
                                    ▼         ▼          ▼
                                 Redis    RabbitMQ    Database
                              (buffering) (async)   (persistence)
```

---

### 5. Order Service

> Spring Boot 2.7.7 — Database: `aika_order`

Payment processing and subscription management across multiple payment providers.

**Core Entities:** `Order`, `ServicePackage`, `Payment`, `AppleNotify`

**Order Status:** `Unpaid` → `Success` | `Cancelled`

**Payment Providers:**

| Provider | SDK Version | Features |
|----------|-------------|----------|
| **Stripe** | v24.0.0 | Payment intents, webhooks, customer management |
| **Apple App Store** | v3.5.0 | IAP verification, subscription renewals, server notifications |
| **Google Play** | v1.32.1 | IAP verification, token validation |
| **Freedompay** | Custom | Alternative payment gateway |

**Additional Features:**
- Multi-country support with currency conversion
- Excel export for order analytics (Apache POI v5.2.3)
- Income analytics by country
- Subscription churn tracking

**Endpoints (10+):**

| Path | Description |
|------|-------------|
| `/app/payment/**` | Payment operations |
| `/app/stripe/**` | Stripe webhooks |
| `/app/apple/**` | Apple IAP verification |
| `/app/google/**` | Google Play verification |
| `/manage/order/**` | Admin order management |
| `/manage/service-package/**` | Subscription package CRUD |

---

### 6. Bot Service

> Spring Boot 2.7.7 — S3 Integration for asset storage

AI bot management, digital human profiles, and interactive game mechanics.

**Key Features:**
- Bot creation, configuration, and publishing
- Digital human profile management
- Voice configuration (TTS settings)
- Game and sphere (category) management
- Bot prompt engineering and knowledge base
- Midjourney integration for AI avatar generation
- DID (Digital Identity) webhook handling

**Endpoints (32+):**

| Path | Description |
|------|-------------|
| `/app/bot/**` | Bot browsing, subscription |
| `/app/chat/**` | Bot conversation |
| `/app/assistant/**` | Assistant configuration |
| `/app/sphere/**` | Category browsing |
| `/app/game/**` | Game mechanics |
| `/manage/bot/**` | Admin bot management |
| `/manage/digital-human/**` | Digital human profiles |
| `/manage/midjourney/**` | AI image generation |

---

### 7. Admin Service

> Spring Boot 2.7.7

Backend management APIs for the admin panel, including analytics, RBAC, and audit logging.

**Controllers:**

| Controller | Purpose |
|------------|---------|
| `AuthController` | Admin authentication |
| `ManageUserController` | User management |
| `ManageRoleController` | Role-based access control |
| `ManageResourcesController` | API resource registry |
| `ManageAnalyticsSubController` | Analytics aggregation |
| `ManageStatisticsController` | Dashboard statistics |
| `ManageEmailLogController` | Email audit logs |
| `ManageSmsLogController` | SMS audit logs |
| `ManageOperationLogController` | Operation audit trail |
| `ManageLineChartController` | Time-series data for charts |

**Scheduled Tasks:**
- `UserDataTask` — Daily user analytics calculation at 1:00 AM UTC (Quartz)

---

### 8. Admin Panel

> React 18 + UMI 4 + Ant Design 5

Single-page application for platform administration with real-time updates via MQTT.

**Environments:**

| Environment | Config File | API Host |
|-------------|-------------|----------|
| Development | `config.ts` | `https://api-test.aikavision.com` |
| Staging | `config.staging.ts` | Staging API |
| Production | `config.production.ts` | Production API |

**Modules (19 route groups):**

| Module | Pages | Features |
|--------|-------|----------|
| **Analytics** | Subscriptions, User, Income, Download | Dashboard metrics & data exports |
| **Bot Management** | Category, Built-in Bots, Explore | Bot CRUD, category management |
| **Story Management** | Stories, Gifts, Categories | Content CRUD with AI prompts |
| **Financial** | Orders, Service Packages | Income tracking, package management |
| **User Management** | User View, Groups | User profiles, segmentation |
| **Support** | Feedback, Reports | User feedback, content reports |
| **System** | Admin, Roles, Permissions, Dictionary, Assistant | RBAC, interest tags, digital humans |
| **Notifications** | Push Notifications, Email Logs, Ops Logs | Campaign management, audit trail |
| **Content** | Posts, Sensitive Words, Blocked Authors | Content moderation tools |
| **Groups** | Group Management, Members | Group CRUD and membership |
| **Game** | Game List, Results | Game configuration, leaderboards |
| **Sphere** | Category Management | Content categorization |
| **User Tasks** | Task List | User task assignments |

---

### 9. Mobile App (AIKA Next)

> React Native + Expo 54 — iOS & Android

The user-facing mobile application built with Expo Router for file-based routing, WatermelonDB for local storage, and Firebase for auth/push notifications.

**Version:** 1.4.0 | **Bundle ID (iOS):** `com.umaylab.aisa` | **Package (Android):** `com.umaylab.aika`

**Key Features:**

| Feature | Technology |
|---------|-----------|
| **Navigation** | Expo Router (file-based) + React Navigation 7 |
| **Authentication** | Firebase Auth, Google Sign-In, Apple Sign-In |
| **Push Notifications** | Firebase Cloud Messaging |
| **In-App Purchases** | expo-iap (Apple & Google) |
| **Local Database** | WatermelonDB 0.28 |
| **Media** | Camera, image picker, audio recording, video playback |
| **Real-time Chat** | MQTT.js over WebSocket |
| **3D Graphics** | expo-three (Three.js) |
| **Internationalization** | Custom i18n with code generation (`yarn i18n`) |
| **API Client** | Axios + OpenAPI code generation (`yarn openapi`) |
| **Secure Storage** | expo-secure-store (Keychain/Keystore) |

**Platform Configuration:**

| Platform | Min Target | Key Features |
|----------|-----------|--------------|
| iOS | 15.1 | Apple Sign-In, Face ID, push notifications, PiP video |
| Android | SDK 35 | Adaptive icons, edge-to-edge UI, audio recording |
| Web | Metro bundler | Static output |

---

## Technology Stack

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| Language | Kotlin / Java | 1.9.22 / 17 |
| Framework | Spring Boot | 2.7.7 – 3.1.5 |
| Cloud | Spring Cloud | 2021.0.3 – 2022.0.4 |
| Service Mesh | Spring Cloud Alibaba (Nacos, Sentinel) | 2021.0.1 – 2022.0.0 |
| API Gateway | Spring Cloud Gateway (Reactive) | — |
| ORM | MyBatis Plus | 3.5.3.1 |
| DB Migration | Flyway | 9.5.1 |
| Distributed Lock | Redisson | 3.23.5 |
| JWT | jjwt / Auth0 JWKS | 0.12.6 / 0.12.0 |
| Build Tool | Maven | 3 |
| Container Base | SkyWalking Java Agent | 8.13.0-java17 |

### Frontend (Admin Panel)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 18.2.0 |
| Meta Framework | UMI | 4.x |
| UI Library | Ant Design | 5.x |
| Pro Components | Ant Design Pro Components | 2.x |
| Real-time | MQTT.js | 5.5.0 |
| Markdown | react-markdown | — |
| Package Manager | Yarn / pnpm | — |

### Mobile (AIKA Next)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React Native (Expo) | 54.0 |
| Routing | Expo Router | 6.x |
| Navigation | React Navigation | 7.x |
| Local DB | WatermelonDB | 0.28.0 |
| Auth | Firebase Auth + Google Sign-In + Apple Auth | 22.4 / 15.0 |
| Push | Firebase Cloud Messaging | 22.4 |
| In-App Purchases | expo-iap | 3.1.6 |
| HTTP Client | Axios | 1.11.0 |
| Hooks | ahooks | 3.9.0 |
| 3D | expo-three (Three.js) | 8.0.0 |
| Lists | @shopify/flash-list | 2.0.2 |
| Package Manager | pnpm | — |

---

## LLM Providers (Conversational AI Core)

The **Content Service** integrates with multiple LLM providers for AI-powered features:

### OpenAI

| Feature | Model | Endpoint |
|---------|-------|----------|
| Chat Completions | GPT-4o-mini (configurable) | `/v1/chat/completions` |
| Function Calling | GPT-4o-mini | `/v1/chat/completions` |
| Speech-to-Text | Whisper-1 | `/v1/audio/transcriptions` |
| Content Moderation | — | `/v1/moderations` |
| File Handling | — | `/v1/files` |

- Configurable API key and proxy settings
- Implementation: `GptClient`, `OpenaiRestHandler`

### Deepseek

| Feature | Model | Endpoint |
|---------|-------|----------|
| Chat Completions | deepseek-chat (configurable) | `/chat/completions` |
| Structured Extraction | deepseek-chat | `/chat/completions` |

- Used primarily for structured JSON extraction from content
- Implementation: `DeepseekClient`, `DeepseekRestHandler`

### AI Pipeline Flow

```
User Input ──► Content Moderation (OpenAI) ──► Sensitive Word Filter
                                                      │
                                                      ▼
                                              LLM Chat Completion
                                           (OpenAI GPT / Deepseek)
                                                      │
                                          ┌───────────┼───────────┐
                                          ▼           ▼           ▼
                                    Function      Structured    Free-form
                                    Calling       JSON Output   Response
                                                      │
                                                      ▼
                                              GptReqLog (Audit)
```

### LLM Observability

All LLM API calls are logged to the `GptReqLog` table with:
- Request URL, HTTP method, parameters
- Response status code and body
- Execution time (ms)
- Caller context (service, user)

---

## Database

### MySQL 8.0

Per-service schema isolation with Flyway-managed migrations.

| Schema | Service | Key Tables |
|--------|---------|------------|
| `aika_content` | Content Service | `t_story`, `t_story_chapter`, `t_post`, `t_comment`, `t_author`, `t_gift`, `t_category`, `t_thumb`, `gpt_req_log`, `sensitive_words` |
| `aika_user` | User Service | `user` (35+ columns), `firebase_user_token`, `video_rekognition_job`, `user_feedback`, `app_group` |
| `aika_order` | Order Service | `order`, `service_package`, `payment`, `apple_notify` |
| `aika_admin` | Admin Service | Admin configurations, roles, resources, audit logs |

**ORM Features (MyBatis Plus):**
- Logical deletion (`@TableLogic`)
- Optimistic locking (`@Version`)
- Custom type handlers (JSON columns, JDBC arrays)
- Pagination plugin
- Code generation support

**Schema Migrations:**
- Managed by Flyway 9.5.1
- Versioned SQL scripts in `src/main/resources/db/migration/`
- Naming convention: `V1.0.x__description.sql`

---

## Message Queue

### RabbitMQ

AMQP-based inter-service messaging with direct exchanges and topic-based routing. Configured centrally via Nacos (`rabbitmq.yaml`).

**Primary Queues:**

| Queue | Exchange | Purpose |
|-------|----------|---------|
| `USER_BOT_INFO_QUEUE` | `USER_COUNT_DIRECT_EXCHANGE` | Bot count updates |
| `USER_SUBSCRIPT_BOT_COUNT_QUEUE` | `USER_COUNT_DIRECT_EXCHANGE` | Bot subscription counts |
| `USER_FANS_COUNT_QUEUE` | `USER_COUNT_DIRECT_EXCHANGE` | Follower count sync |
| `USER_STORIES_INFO_QUEUE` | `USER_COUNT_DIRECT_EXCHANGE` | Story metrics updates |
| `EMAIL_SEND_RECORD_QUEUE` | `EMAIL_SEND_RECORD_EXCHANGE` | Email delivery audit logs |
| `OPERATION_LOG_QUEUE` | `OPERATION_LOG_EXCHANGE` | Operation audit trail |
| `USER_NOTIFY_QUEUE` | `USER_NOTIFY_EXCHANGE` | User notifications & alerts |

Each service has dedicated consumers for async event processing.

### MQTT (EMQX)

Lightweight pub/sub protocol for real-time chat delivery over WebSocket (TLS).

| Topic | QoS | Purpose |
|-------|-----|---------|
| `chat/bot/topic/{botId}` | 1 | Bot incoming messages |
| `chat/user/topic/{userId}` | 1 | User incoming messages |

- **Broker:** EMQX (`wss://api-test.aikavision.com:443`)
- **Client:** Eclipse Paho 1.2.5 (backend), MQTT.js 5.5 (frontend)
- **Auth:** JWT-based connection and topic authorization via Chat Service webhooks

---

## Caching

### Redis

Used across all services with different access patterns:

| Service | Usage | Library |
|---------|-------|---------|
| Gateway | RBAC permission caching, JWT blacklist | Spring Data Redis Reactive |
| Content Service | Hot data caching, distributed locks | Redisson 3.23.5 |
| Chat Service | Message buffering, deduplication | Spring Data Redis |
| User Service | Session caching, token storage | Spring Data Redis |
| All Services | Shared configuration cache | Spring Boot Starter Data Redis |

**Configuration:** Password-protected, single instance (port 6379).

---

## Monitoring & Logging

### Distributed Tracing — Apache SkyWalking 8.13

All backend services are instrumented with the SkyWalking Java Agent, providing:

- **Distributed Transaction Tracing** — End-to-end request tracking across microservices
- **Spring Cloud Gateway Plugin** — Trace propagation through the API gateway
- **Spring WebFlux Plugin** — Reactive stack support
- **Logback Integration** — Automatic trace ID injection into log entries (`apm-toolkit-logback-1.x`)

```
# SkyWalking configuration
Base Image:  apache/skywalking-java-agent:8.13.0-java17
Collector:   skywalking-oap:11800 (gRPC)
Env Var:     SW_AGENT_COLLECTOR_BACKEND_SERVICES
```

### Logging — Logback

- **Framework:** Logback 1.x with SLF4J
- **Trace Correlation:** SkyWalking trace IDs injected into every log line
- **Environment Profiles:** Separate logback configurations for staging and production
- **Audit Logging:** Operation logs sent to RabbitMQ (`OPERATION_LOG_QUEUE`) for centralized audit trail

---

## Security

### Authentication & Authorization

```
Client Request
      │
      ▼
┌─────────────────────────────────────────┐
│            Gateway AuthFilter            │
│                                         │
│  1. Extract JWT from Authorization header│
│  2. Validate token signature (HMAC-SHA) │
│  3. Determine user type                 │
│     ├── APPUSER  → App endpoints        │
│     └── ADMINUSER → Manage endpoints    │
│  4. Check user status (enabled/disabled)│
│  5. RBAC: match URI against role perms  │
│     (Redis: role:resource:paths:{id})   │
│  6. Inject userId, roleId into headers  │
└─────────────────────────────────────────┘
      │
      ▼
  Downstream Service
```

**Authentication Methods:**

| Method | Provider | Service |
|--------|----------|---------|
| Email/Password | Internal | User Service |
| Google OAuth 2.0 | Google | User Service |
| Apple Sign-In | Apple | User Service |
| Facebook OAuth | Facebook | User Service |
| JWT Token | jjwt 0.12.6 + Auth0 JWKS 0.12.0 | Gateway |

**Fault Tolerance:**
- Alibaba Sentinel for circuit breaking and rate limiting at the gateway level

**GDPR Compliance:**
- User data deletion endpoint: `DELETE /public/delete/user/data`
- Email verification required for data deletion requests

---

## External Integrations

| Category | Provider | SDK/Version | Service | Purpose |
|----------|----------|-------------|---------|---------|
| **LLM** | OpenAI | REST API | Content | GPT-4o-mini, Whisper, Moderation |
| **LLM** | Deepseek | REST API | Content | Chat completions, JSON extraction |
| **AI Image** | Midjourney | Custom API | Bot | Bot avatar generation |
| **Digital ID** | DID Services | Webhooks | Bot | Identity verification |
| **Cloud Storage** | AWS S3 | SDK v2.20 | User, Bot | File uploads, asset storage |
| **Video** | AWS MediaConvert | SDK v2.20 | User | Video transcoding |
| **Vision** | AWS Rekognition | SDK v2.20 | User | Image/video analysis & moderation |
| **Push** | Firebase Cloud Messaging | Admin SDK v9.2 | User | Push notifications |
| **Auth** | Firebase Admin | v9.2.0 | User | Authentication provider |
| **Auth** | Google OAuth 2.0 | — | User | Social login |
| **Auth** | Apple Sign-In | — | User | Social login |
| **Auth** | Facebook OAuth | — | User | Social login |
| **Auth** | Auth0 JWKS | v0.12.0 | Gateway | JWT key validation |
| **Payments** | Stripe | v24.0.0 | Order | Web/API payments, webhooks |
| **Payments** | Apple App Store | v3.5.0 | Order | IAP verification, subscriptions |
| **Payments** | Google Play Billing | v1.32.1 | Order | IAP verification |
| **Payments** | Freedompay | Custom | Order | Alternative payment gateway |
| **Recommendations** | Gorse | REST API | User | Personalized content recommendations |
| **Chat Broker** | EMQX | MQTT/WSS | Chat | Real-time messaging |

---

## Deployment

### Docker

All backend services are containerized using `apache/skywalking-java-agent:8.13.0-java17` as the base image, providing built-in APM instrumentation.

### Environment Configuration

| Environment | Nacos Namespace | Docker Compose | Replicas | Runner Tag |
|-------------|----------------|----------------|----------|------------|
| Local | `local` | — | 1 | — |
| Test CI | `testci` | — | 1 | — |
| Staging | `staging` | `docker-compose.yml` | 1 | `usaikastaging` |
| Production | `production` | `docker-compose-prod.yml` | 2 | `usaikaproduction` |

### Resource Limits

| Environment | CPU Limit | CPU Reserved | Memory Limit | Memory Reserved |
|-------------|-----------|-------------|--------------|-----------------|
| Staging | 1.0 core | 0.5 core | 1024 MB | 512 MB |
| Production | 1.0 core | 0.5 core | 1024 MB | 512 MB |

### Docker Compose

```bash
# Staging deployment
docker stack deploy -c docker-compose.yml aika

# Production deployment
docker stack deploy -c docker-compose-prod.yml aika
```

- **Network:** External Docker network `aika_net`
- **Restart Policy:** `on-failure` with health checks
- **Production:** 2 replicas per service (HA), 10-second update delay, auto-rollback on failure
- **Admin Service:** Always 1 replica (stateful)

### CI/CD Pipeline (GitLab)

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌──────────────┐
│  Build  │────►│  Test    │────►│ Image Build│────►│   Deploy     │
│  (Maven)│     │(Int.Test)│     │ (Docker)   │     │(Docker Stack)│
└─────────┘     └──────────┘     └────────────┘     └──────────────┘
```

**Stages:**

| Stage | Command | Services | Trigger |
|-------|---------|----------|---------|
| **Build** | `mvn clean integration-test` | MySQL 8.0, Redis, RabbitMQ | All branches |
| **Image** | Docker build & push to AWS ECR | — | `master`, `release/*` |
| **Staging** | `docker stack deploy` | — | `master` |
| **Production** | `docker stack deploy` (blue-green) | — | `release/*` |

**Container Registry:** AWS ECR (`533267032061.dkr.ecr.ap-south-1.amazonaws.com`)

### Configuration Management (Nacos)

Centralized service discovery and configuration management via Alibaba Nacos.

**Shared Configs:**

| Config File | Purpose |
|-------------|---------|
| `rabbitmq.yaml` | RabbitMQ connection settings |
| `jwt-key.yaml` | JWT signing key |

**Key Environment Variables:**

```bash
NACOS_NS                                # Namespace (staging/production)
NACOS_ADDR                              # Nacos server address
NACOS_USERNAME / NACOS_PASSWORD          # Nacos credentials
AWS_ACCESS_KEY_ID / SECRET_ACCESS_KEY    # AWS credentials
JVM_OPTS                                # JVM memory and tuning options
SW_AGENT_COLLECTOR_BACKEND_SERVICES     # SkyWalking OAP collector address
```

---

## Testing

| Framework | Purpose |
|-----------|---------|
| Spring Boot Test | Integration testing with MockMvc |
| Mockito Kotlin 3.2 | Unit test mocking |
| JUnit 5 | Test runner |
| Docker Services (CI) | MySQL, Redis, RabbitMQ containers for integration tests |

**Test Configuration:** Each service has `application-testci.yaml` for CI-specific settings.

**Test Coverage:** 20+ test classes across content, bot, and order services — covering controllers, RabbitMQ consumers, and service logic.

---

## Getting Started

### Prerequisites

- JDK 17
- Maven 3
- Node.js 18+ (Yarn for admin-panel, pnpm for mobile app)
- Docker & Docker Compose
- MySQL 8.0, Redis, RabbitMQ, EMQX (MQTT broker)
- Nacos server
- Android Studio / Xcode (for mobile development)

### Backend

```bash
# Build all services
mvn clean package -DskipTests

# Run a single service (e.g., gateway)
cd gateway
cp src/main/resources/application-local.yaml.template src/main/resources/application-local.yaml
# Edit application-local.yaml with your local Nacos, DB, Redis config
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Admin Panel

```bash
cd admin-panel
yarn install

yarn start             # Development (proxies to https://api-test.aikavision.com)
yarn build:staging     # Staging build
yarn build             # Production build
```

### Mobile App

```bash
cd app-next
pnpm install

pnpm start             # Start Expo dev server
pnpm android           # Run on Android emulator/device
pnpm ios               # Run on iOS simulator/device
pnpm web               # Start web preview

# Code generation
pnpm i18n              # Generate i18n translation types
pnpm openapi           # Generate API client from OpenAPI spec
```

**Prerequisites (Mobile):**
- Node.js 18+
- pnpm
- Expo CLI (`npx expo`)
- Android Studio (for Android builds) or Xcode (for iOS builds)
- Firebase config files: `google-services.json` (Android), `GoogleService-Info.plist` (iOS)

---

## Project Structure

```
aika/
├── gateway/                    # API Gateway (Spring Cloud Gateway)
│   ├── src/main/kotlin/
│   │   └── com/parsec/aika/gateway/
│   │       ├── filter/         # AuthFilter, request filters
│   │       └── props/          # Configuration properties
│   ├── Dockerfile
│   ├── docker-compose.yml      # Staging deployment
│   └── docker-compose-prod.yml # Production deployment
│
├── content-service/            # Content & AI Service
│   ├── src/main/kotlin/
│   │   └── com/parsec/aika/content/
│   │       ├── gpt/            # LLM clients (GptClient, DeepseekClient, OpenaiRestHandler)
│   │       ├── service/        # Business logic
│   │       └── controller/     # REST controllers
│   └── src/main/resources/
│       └── db/migration/       # Flyway SQL migrations
│
├── user-service/               # User & Auth Service
│   ├── src/main/kotlin/
│   │   └── com/parsec/aika/user/
│   │       ├── config/         # Firebase, Quartz, RabbitMQ configs
│   │       ├── controller/     # REST controllers
│   │       ├── consumer/       # RabbitMQ message consumers
│   │       └── job/            # Quartz scheduled jobs
│   └── .gitlab-ci.yml
│
├── chat-service/               # Real-Time Chat (MQTT)
│   └── src/main/kotlin/
│       └── com/parsec/aika/chat/
│           └── mqtt/           # MQTT handler & EMQX auth
│
├── order-service/              # Payment & Orders
│   └── src/main/kotlin/
│       └── com/parsec/aika/order/
│           ├── controller/     # Stripe, Apple, Google Pay controllers
│           └── service/        # Payment processing logic
│
├── bot-service/                # Bot Management
│   └── src/main/kotlin/
│       └── com/parsec/aika/bot/
│           ├── controller/     # Bot, game, sphere, Midjourney controllers
│           └── service/        # Bot lifecycle management
│
├── admin-service/              # Admin Backend
│   └── src/main/kotlin/
│       └── com/parsec/aika/admin/
│           ├── controller/     # Management controllers
│           └── task/           # Quartz analytics jobs
│
├── admin-panel/                # Admin Frontend (React)
│   ├── config/
│   │   ├── routes.ts           # Route definitions (520+ lines)
│   │   ├── config.ts           # Dev config
│   │   ├── config.staging.ts   # Staging config
│   │   └── config.production.ts# Production config
│   ├── src/
│   │   ├── pages/              # Page components (19 modules)
│   │   ├── services/           # API service layer
│   │   └── components/         # Shared UI components
│   ├── package.json
│   └── .gitlab-ci.yml
│
└── app-next/                   # Mobile App (React Native + Expo)
    ├── app/                    # File-based routing (Expo Router)
    ├── pages/                  # Page components
    ├── components/             # Reusable UI components
    ├── services/               # API service layer (Axios)
    ├── database/               # WatermelonDB schema & models
    ├── i18n/                   # Internationalization & code generation
    ├── assets/                 # Icons, images, fonts
    ├── openapi.config.mjs      # API client code generation config
    ├── app.json                # Expo configuration
    └── package.json
```

## Documentation

For detailed documentation and API references, visit: https://claude.ai/public/artifacts/4263e826-91fd-400c-befd-51d3211913f9

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
