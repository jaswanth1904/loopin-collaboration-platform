"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState("default");
    const [cursorText, setCursorText] = useState("");

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Get closest data-cursor up the tree, in case of nested elements
            const cursorTarget = target.closest('[data-cursor]');

            if (cursorTarget) {
                const cursorType = cursorTarget.getAttribute("data-cursor");
                const cursorTextAttr = cursorTarget.getAttribute("data-cursor-text");

                setCursorVariant(cursorType || "default");
                if (cursorTextAttr) setCursorText(cursorTextAttr);
            } else {
                setCursorVariant("default");
                setCursorText("");
            }
        };

        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", () => {
            setCursorVariant("default");
            setCursorText("");
        });

        return () => {
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            height: 16,
            width: 16,
            backgroundColor: "rgba(15, 23, 42, 1)", // slate-900
            mixBlendMode: "normal" as any,
            border: "0px solid transparent"
        },
        click: {
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            height: 64,
            width: 64,
            backgroundColor: "rgba(99, 102, 241, 0.9)", // indigo-500
            color: "#ffffff",
            mixBlendMode: "normal" as any,
        },
        drag: {
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            height: 80,
            width: 80,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#4f46e5", // indigo-600
            mixBlendMode: "normal" as any,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-center"
            variants={variants}
            animate={cursorVariant}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: cursorVariant !== "default" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {cursorText}
            </motion.span>
        </motion.div>
    );
};
