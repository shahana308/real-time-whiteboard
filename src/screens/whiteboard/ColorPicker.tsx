import React from "react";
import { CirclePicker } from "react-color";

const ColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: { hex: React.SetStateAction<string> }) => void;
}) => {
  return (
    <div>
      <CirclePicker color={color} onChangeComplete={onColorChange} />
    </div>
  );
};

export default ColorPicker;
