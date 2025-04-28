import { useId } from 'react'
import styles from './Star.module.css'

export interface StarProps {
    percentFilled: number // between 0 and 100
}

export default function Star(props: StarProps) {
    const id = useId()
    return (
        <svg className={styles["star"]} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
            <defs>
                <linearGradient id={`grad-${id}`}>
                    <stop offset={`${props.percentFilled}%`} stopColor="rgb(222, 121, 38)"/>
                    <stop offset={`${props.percentFilled}%`} stopColor="grey"/>
                </linearGradient>
            </defs>
            <path fill={`url(#grad-${id})`} d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/>
        </svg>
    )
}