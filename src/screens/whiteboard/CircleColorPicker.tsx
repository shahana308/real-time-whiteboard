import { Typography } from "antd";
import React from "react";
import { CirclePicker } from "react-color";

const colors = [
  // Nude and Natural Shades
  "#f5e0c7", // Light beige
  "#e6c6a6", // Peach
  "#d5b395", // Soft tan
  "#f8edeb", // Off-white
  "#ffedda", // Light cream

  // Pastel and Soft Colors
  "#f5e0c5", // Light beige
  "#e6c6a7", // Peach
  "#ffd3b6", // Soft coral
  "#ffb7c3", // Soft pink
  "#fcd5ce", // Light pink
  "#d8e2dc", // Pastel gray
  "#ffeddb", // Light cream
  "#cdeac0", // Pale green
  "#bde0fe", // Light blue
  "#a2d2ff", // Sky blue
  "#cddafd", // Light lavender
  "#f6e9ff", // Soft lilac
  "#f3e8ff", // Light purple
  "#f8edec", // Off-white
];

const CircleColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: { hex: React.SetStateAction<string> }) => void;
}) => {
  return (
    <div>
      <Typography.Title level={5} className="!text-gray-500 !font-normal !mb-6">
        Nude & Soft Colors
      </Typography.Title>
      <CirclePicker
        color={color}
        onChangeComplete={onColorChange}
        colors={colors}
        width="300px"
      />
    </div>
  );
};

export default CircleColorPicker;
