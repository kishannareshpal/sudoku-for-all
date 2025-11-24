import { cn } from '@/lib/cn';
import { PressableBounce, PressableBounceProps } from '../pressable-bounce';

type IconButtonProps = Omit<PressableBounceProps, 'children'> & {
    children: PressableBounceProps['children']
}

export const IconButton = ({ className, children: icon, ...props }: IconButtonProps) => {
    return (
        <PressableBounce
            className={cn("rounded-full justify-center items-center size-10", className)}
            {...props}
        >
            {icon}
        </PressableBounce>
    )
}