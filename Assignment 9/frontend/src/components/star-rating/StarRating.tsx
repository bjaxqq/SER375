import Star from './Star'
import styles from './StarRating.module.css'

export interface StarRatingProps {
    rating: number // between 0 and 5, decimals allowed
}

export default function StarRating(props: StarRatingProps) {
    function createStars() {
        return Array.from({ length: 5 }).map((_, index) => {
            const percentFilled = Math.min(100, Math.max(0, (props.rating - index) * 100))
            return (
                <Star key={index} percentFilled={percentFilled} />
            )
    
        })
    }

    return (
        <div className={styles.container}>
            { createStars() }
        </div>
    )


}