import React from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: { hex: React.SetStateAction<string> }) => void;
}) => {
  return (
    <div>
      <SketchPicker
        color={color}
        onChangeComplete={onColorChange}
        disableAlpha={true}
      />
    </div>
  );
};

export default ColorPicker;
