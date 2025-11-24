import { cn } from "@/lib/cn"
import { View, ViewProps } from "react-native"

type ControlGroupProps = ViewProps

export const ControlGroup = ({ children, className, ...props }: ControlGroupProps) => {
    return (
        <View
            className={
                cn(
                    "flex-row gap-3 bg-neutral-100 border border-neutral-300 rounded-full p-1.5",
                    className
                )
            }
            {...props}
        >
            {children}
        </View>
    )
}