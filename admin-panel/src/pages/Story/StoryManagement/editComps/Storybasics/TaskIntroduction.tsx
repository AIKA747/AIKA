import { Input } from 'antd';
const { TextArea } = Input;

export default (props: any) => {
  const { value, onChange } = props;

  return (
    <>
      <div>
        {
          'When users enter the story chat, they will send messages in a conversational manner. Inform users of the elements needed to progress the story.'
        }
      </div>
      <TextArea
        rows={6}
        placeholder="For example: The story is divided into three chapters. You need to encourage the character to seek the true meaning of life after understanding the character's background. Enable them to achieve cognitive enhancement of self-worth. And in the third chapter, help the character successfully confess their love to the princess."
        value={value}
        onChange={(e) => {
          const textValue = e.target.value;
          onChange?.(textValue);
        }}
        allowClear
      />
    </>
  );
};
