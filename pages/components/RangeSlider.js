import * as Slider from '@radix-ui/react-slider'
import styles from '../styles/RangeSlider.module.css'

export default function RangeSlider({
  defaultMin,
  defaultMax,
  min,
  max,
  onValueChange,
}) {
  return (
    <Slider.Root
      className={styles.root}
      defaultValue={[defaultMin, defaultMax]}
      min={min}
      max={max}
      onValueChange={onValueChange}
    >
      <Slider.Track className={styles.track}>
        <Slider.Range className={styles.range} />
      </Slider.Track>
      <Slider.Thumb className={styles.thumb} />
      <Slider.Thumb className={styles.thumb} />
    </Slider.Root>
  )
}
