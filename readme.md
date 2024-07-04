# @preachjs/datepicker

> Headless Datepicker(s) for preact

- [@preachjs/datepicker](#preachjsdatepicker)
  - [Highlights](#highlights)
  - [Usage](#usage)
    - [Simple Inline Datepicker](#simple-inline-datepicker)
    - [Create a range select date picker](#create-a-range-select-date-picker)
    - [API](#api)
  - [License](#license)

## Highlights

- Lightweight
- Unstyled
- Fast and runs on signals
- For [Preact](https://preactjs.com/)! <3

## Usage

- Install the package and it's deps

```sh
npm i preact @preachjs/datepicker @preact/signals
```

### Simple Inline Datepicker

```js
import { Calendar } from '@preachjs/datepicker'

function App() {
  const [date, setDate] = useState()
  return (
    <>
      <Calendar value={date} onSelect={nextValue => setDate(nextValue)} />
    </>
  )
}
```

### Create a range select date picker

```tsx
import { Calendar } from '@preachjs/datepicker'

function App() {
  const [dateRange, setDateRange] = useState([])
  return (
    <>
      <Calendar
        mode="range"
        value={dateRange}
        onSelect={nextValue => setDateRange(nextValue)}
      />
    </>
  )
}
```

### API

| prop            | description                                                                                                       | default      |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| `value`         | The current value of the datepicker                                                                               | current date |
| `onSelect`      | Callback fired when a date selection is successful, in case of `range` selection, it'll fire with both the values |              |
| `mode`          | Switch between single select and range selection mode                                                             | `single`     |
| `weekdayFormat` | `narrow,short,long` weekend format on the calendar header                                                         | `narrow`     |
| `arrowLeft`     | Icon Rendered on the left of the month selector                                                                   | `&lt;`       |
| `arrowRight`    | Icon Rendered on the right of the month selector                                                                  | `&gt;`       |
| `readOnly`      | Change to readOnly mode, date selection will do nothing                                                           | `false`      |

## License

[MIT](/LICENSE)
