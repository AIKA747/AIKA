import { createAudioPlayer } from 'expo-audio';
import { AudioPlayer } from 'expo-audio/src/AudioModule.types';
import { isEmpty } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';

import ForwardedText from '@/components/Chat/ChatList/ForwardedText';
import { LoadingOutline, PlayOutline } from '@/components/Icon';
import WaveLoading from '@/components/WaveLoading';
import { FileProperty } from '@/hooks/useChatClient';
import pxToDp from '@/utils/pxToDp';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextVoiceProps } from './types';

let currentPlayStopFunction: (() => Promise<void>) | null = null;

export default function MessageContextVoice(props: MessageContextVoiceProps) {
  const { messageItem, messagePosition = 'left', repeat, onLongPress, disabled } = props;
  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition];

  const soundRef = useRef<AudioPlayer>(null);

  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const time = useMemo(() => {
    let seconds = 0;
    const filePropertyRaw = messageItem.fileProperty;
    try {
      let fileProperty: FileProperty = JSON.parse(filePropertyRaw!);
      // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
      if (typeof fileProperty === 'string') fileProperty = JSON.parse(fileProperty);
      seconds = Math.round(Number(fileProperty.length) || 0);
    } catch {
      console.warn('Voice - Invalid fileProperty:', filePropertyRaw, '\nmsgId:', messageItem.msgId);
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }, [messageItem]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={isPlayLoading || disabled}
      onLongPress={onLongPress}
      onPress={async () => {
        if (isPlaying) {
          soundRef.current?.pause();
          currentPlayStopFunction = null;
          setIsPlaying(false);
          return;
        }

        if (currentPlayStopFunction) {
          await currentPlayStopFunction();
          currentPlayStopFunction = null;
        }

        try {
          setIsPlayLoading(true);
          const player = createAudioPlayer({ uri: messageItem?.media });
          console.log('createAsync end');
          setIsPlayLoading(false);
          setIsPlaying(true);
          soundRef.current = player;

          // 由其它语音播放打断
          currentPlayStopFunction = async () => {
            player.pause();
            setIsPlaying(false);
          };
          // 设置音量
          // await sound.setVolumeAsync(1);

          player.play();
          // 等待播放完成
          await new Promise((resolve) => {
            const timer = setInterval(() => {
              if (!player.currentStatus.playing && !player.currentStatus.isBuffering && player.currentStatus.isLoaded) {
                soundRef.current = null;
                setIsPlaying(false);
                clearInterval(timer);
                resolve(true);
              }
            }, 100);
          });
        } catch (e) {
          console.log('Play error:', e);
        } finally {
          setIsPlaying(false);
          setIsPlayLoading(false);
        }
      }}
      style={[
        styles.container,
        stylesPosition.container,
        {
          backgroundColor: '#A07BED',
        },
        !isEmpty(messageItem.forwardInfo) && {
          paddingTop: pxToDp(12),
        },
      ]}>
      <ForwardedText message={messageItem} position={messagePosition} />
      {/* <Text style={[styles.text]}>{messageItem.textContent}</Text> */}
      {messageItem.username && messagePosition === 'left' ? (
        <View
          style={{
            marginTop: -pxToDp(12),
            marginBottom: pxToDp(12),
          }}>
          <Text
            style={[
              styles.username,
              stylesPosition.username,
              {
                color: '#ffffff' + 80,
              },
            ]}>
            {messageItem.username}
          </Text>
        </View>
      ) : undefined}
      <View style={[styles.containerWrapper]}>
        <DropShadow
          style={[
            // styles.itemDropShadow,
            {
              shadowColor: '#301190',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 8,
            },
          ]}>
          <View
            style={[
              styles.iconWrapper,
              stylesPosition.iconWrapper,
              {
                backgroundColor: '#fff',
              },
            ]}>
            {isPlaying ? (
              <View
                style={[
                  {
                    width: pxToDp(22),
                    height: pxToDp(22),
                    backgroundColor: '#A07BED',
                    borderRadius: pxToDp(2),
                  },
                ]}
              />
            ) : isPlayLoading ? (
              <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color="#000" />
            ) : (
              <PlayOutline width={pxToDp(44)} height={pxToDp(44)} color="#A07BED" />
            )}
          </View>
        </DropShadow>

        <View style={[styles.infoWrapper]}>
          <View style={[styles.wave]}>
            <WaveLoading run={isPlaying} repeat={repeat} color="#fff" />
          </View>
          <Text style={[styles.text, { color: '#fff' }]}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
