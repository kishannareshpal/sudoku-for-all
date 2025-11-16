import { PressableBounce, PressableBounceProps } from '../pressable-bounce';

import { clsx } from 'clsx';

type IconButtonProps = Omit<PressableBounceProps, 'children'> & {
    children: PressableBounceProps['children']
}

export const IconButton = ({ className, children: icon, ...props }: IconButtonProps) => {
    return (
        <PressableBounce
            className={clsx("rounded-full justify-center items-center size-10", className)}
            {...props}
        >
            {icon}
        </PressableBounce>
    )
}