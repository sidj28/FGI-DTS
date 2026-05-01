import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            src="/images/fgi-logo.png" 
            alt="Focus Global Logo" 
            {...props} 
        />
    );
}
