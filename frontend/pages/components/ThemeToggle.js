"use client";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

export default function ThemeToggle() {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        themeChange(false);

        const currentTheme = document.documentElement.getAttribute("data-theme");
        setIsChecked(currentTheme === "dark");
    }, []);

    const handleToggle = () => {
        const newTheme = isChecked ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        setIsChecked(!isChecked);
    };

    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                className="toggle border-orange-500 bg-orange-400 checked:bg-indigo-500 checked:text-indigo-800 checked:border-indigo-600"
                checked={isChecked}
                onChange={handleToggle}
            />
        </label>
    );
}
