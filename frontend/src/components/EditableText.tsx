import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

type EditableTextProps = {
  text: string;
  onSubmit: (value: string) => void;
};

const EditableText = ({ text, onSubmit }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return isEditing ? (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>) 
    : (<h1>{text+" "}<EditIcon onClick={handleEdit}/></h1>);
};

export default EditableText;