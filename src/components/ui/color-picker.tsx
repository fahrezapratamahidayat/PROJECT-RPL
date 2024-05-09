import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  items?: Item[];
};

type Item = {
  value: string;
  label: string;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  items,
}) => {
  const [color, setColor] = React.useState(value);

  useEffect(() => {
    setColor(value);
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex w-full rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card px-3">
          <div
            style={{ backgroundColor: color }}
            className="w-5 h-5 rounded-md mr-2 border"
          ></div>
          <p className="text-sm text-white">{color}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        {items && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <button
                onClick={() => {
                  onChange && onChange(item.value);
                  setColor(item.value);
                }}
                key={index}
                className="w-5 h-5 rounded-md aspect-square border"
                style={{ backgroundColor: item.value }}
              ></button>
            ))}
          </div>
        )}
        <Input
          value={color}
          onChange={({ currentTarget }) => {
            onChange && onChange(currentTarget.value);
            setColor(currentTarget.value);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
