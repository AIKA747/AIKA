import { Input } from 'antd';
const { TextArea } = Input;

export default (props: any) => {
  const { value, onChange } = props;

  return (
    <>
      {/* <div>
        {
          'When users enter the story chat, they will send messages in a conversational manner. Inform users of the elements needed to progress the story.'
        }
      </div> */}
      <TextArea
        rows={6}
        placeholder="After the user enters this chapter, the story character will automatically send this message. The message should include an introduction to the tasks that need to be completed in the current chapter, as well as an explanation of trigger words."
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
