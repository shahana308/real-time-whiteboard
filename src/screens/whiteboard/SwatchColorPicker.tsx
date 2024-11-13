import { Typography } from "antd";
import React from "react";
import { SwatchesPicker } from "react-color";

const SwatchColorPicker = ({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange: (color: { hex: React.SetStateAction<string> }) => void;
}) => {
  const customColors = [
    ["#f06292", "#ec407a", "#e91e63"], // Pinks
    ["#ef5350", "#e53935", "#d32f2f"], // Reds
    ["#fff176", "#ffee58", "#ffeb3b"], // Yellows
    ["#ffb74d", "#ffa726", "#ff9800"], // Oranges
    ["#81c784", "#66bb6a", "#4caf50"], // Greens
    ["#4db6ac", "#26a69a", "#009688"], // Teals
    ["#4fc3f7", "#29b6f6", "#03a9f4"], // Blues
    ["#64b5f6", "#42a5f5", "#2196f3"], // Blues
    ["#9e9e9e", "#bdbdbd", "#e0e0e0"], // Light gray to white
    ["#a1887f", "#bcaaa4", "#d7ccc8"], // Light browns and off-white
    ["#3e2723", "#5d4037", "#795548"], // Dark brown to light brown
    ["#000000", "#212121", "#424242"], // Black to medium gray
  ];

  return (
    <div>
      <Typography.Title level={5} className="!text-gray-500 !font-normal !mb-4">
        Bright Colors Palette
      </Typography.Title>
      <SwatchesPicker
        color={color}
        styles={{
          default: {
            picker: {
              boxShadow: "none",
            },
          },
        }}
        onChange={onColorChange}
        height={200}
        colors={customColors}
      />
    </div>
  );
};

export default SwatchColorPicker;
