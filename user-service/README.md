# 关于单元测试

本项目为一个微服务，但是大多数情况下我们的开发，可无视微服务环境，把本服务看成是一个独立的项目开发。

在项目中，有一个 application-local.yaml.template 的模板文件，可在本地复制此文件内容 到 application-local.yaml 中，并将 application-local.yaml 加入到 gitignore，修改此文件的配置为本地配置，则可在本地运行单测。

在单测中，如果依赖其它微服务方法，可使用 Mockito 来 Mock 其它服务的方法，以保证不受服务依赖的影响。

比如 在下例中，SpiderTaskAppController调用了SpiderService，而我们不希望 SpiderService 依赖影响到单测。

````Kotlin
@SpringBootTest
@AutoConfigureMockMvc
class SpiderTaskAppControllerTest {

    @Resource
    lateinit var controller: SpiderTaskAppController

    @SpyBean
    lateinit var spiderService: SpiderService

    @Test
    fun testCreateSpiderTask() {
           Mockito.doNothing().`when`(spiderService).callSpider(anyLong())

        val dto = controller.createSpiderTask(spiderTaskCreateVO, user)

        // Some codes to test the controller

    }
}
````

# 关于项目异常处理

当一个RESTFul接口需要返回异常提示，不必在代码中处理返回的内容，可直接使用断言，会有全局的异常组件来自动处理。

比如

````kotlin
    
    val user = appUserMapper.selectById(param.getLong("userId"))
    Assert.notNull(user, "用户【{}】数据为null", param.getLong("userId"))

````

如果要自定义错误代码或者错误信息，可使用 `throw BusinessException` 来抛出异常。

# 关于Feign接口

在项目中，如果我们需要实现一个供其它服务调用的接口，我们可以使用 Feign 来实现。Feign 接口的定义统一放到 endpoint 包下。

如果是要实现一个供其它服务调用的Feign接口，我们可以在remote包下创建接口，使用 `@FeignClient` 注解来定义一个接口，然后在接口中定义需要调用的方法。


# 关于代码提交

每个issue都应该建立一个分支，完成单元测试后，提交MR到Master，由项目的Maintainer进行Code review以后合并分支。
