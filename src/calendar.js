import { useSignal, useComputed } from "@preact/signals";
import {
  getWeekdayList,
  generateListOfDaysForMonthAndYear,
  getMonthAndYearFromDate,
  formatToReadableDate,
} from "./utils";

export function Calendar({
  value = new Date(),
  onSelect = () => {},
  locale = "en-gb",
  weekdayFormat = "short",
  arrowLeft: ArrowLeft = () => <>&lt;</>,
  arrowRight: ArrowRight = () => <>&gt;</>,
}) {
  const activeDate$ = useSignal(new Date(value));
  const weekdays = getWeekdayList(locale, {
    format: weekdayFormat,
  });
  const possibleDates = useComputed(() => {
    const activeDate = activeDate$.value;
    return generateListOfDaysForMonthAndYear(
      activeDate.getMonth(),
      activeDate.getFullYear(),
      {
        weekdays: weekdays,
      }
    );
  });

  return (
    <div class="preachjs-calendar">
      <div class="preachjs-calendar--header">
        <button
          aria-label="Previous"
          onClick={() => {
            const curr = new Date(activeDate$.value);
            curr.setMonth(curr.getMonth() - 1);
            activeDate$.value = curr;
          }}
        >
          <ArrowLeft />
        </button>
        <h2 aria-hidden="true">{getMonthAndYearFromDate(activeDate$.value)}</h2>
        <button
          aria-label="Next"
          onClick={() => {
            const curr = new Date(activeDate$.value);
            curr.setMonth(curr.getMonth() + 1);
            activeDate$.value = curr;
          }}
        >
          <ArrowRight />
        </button>
      </div>
      <table
        class="preachjs-calendar--grid"
        role="grid"
        aria-label={getMonthAndYearFromDate(activeDate$.value)}
        ref={(node) => {
          if (!node) return;
          node.addEventListener("keyup", (e) => {
            const isParentCell =
              Array.from(e.target.parentNode.classList.entries()).findIndex(
                (d) => d[1] == "preachjs-calendar--grid-cell"
              ) > -1;
            const isCell =
              Array.from(e.target.classList.entries()).findIndex(
                (d) => d[1] == "preachjs-calendar--grid-cell"
              ) > -1;

            if (!(isCell || isParentCell)) return;

            const CellTarget = isParentCell ? e.target.parentNode : e.target;
            const currentRow = +CellTarget.dataset.row;
            const currentCol = +CellTarget.dataset.col;

            switch (e.code) {
              case "ArrowDown": {
                const elem = e.target
                  .closest(".preachjs-calendar--grid-body")
                  .querySelector(
                    `[data-row='${currentRow + 1}'][data-col='${currentCol}']`
                  );
                elem?.querySelector("button").focus();
                break;
              }
              case "ArrowUp": {
                const elem = e.target
                  .closest(".preachjs-calendar--grid-body")
                  .querySelector(
                    `[data-row='${currentRow - 1}'][data-col='${currentCol}']`
                  );
                elem?.querySelector("button").focus();
                break;
              }

              case "ArrowRight": {
                let changedCol = currentCol + 1;
                let changedRow = currentRow;
                if (changedCol > 6) {
                  changedRow += 1;
                  changedCol = 0;
                }
                const elem = e.target
                  .closest(".preachjs-calendar--grid-body")
                  .querySelector(
                    `[data-row='${changedRow}'][data-col='${changedCol}']`
                  );
                elem?.querySelector("button").focus();
                break;
              }
              case "ArrowLeft": {
                let changedCol = currentCol - 1;
                let changedRow = currentRow;
                if (changedCol < 0) {
                  changedRow -= 1;
                  changedCol = 6;
                }
                const elem = e.target
                  .closest(".preachjs-calendar--grid-body")
                  .querySelector(
                    `[data-row='${changedRow}'][data-col='${changedCol}']`
                  );
                elem?.querySelector("button").focus();
                break;
              }
            }
          });
        }}
      >
        <thead class="preachjs-calendar--grid-header">
          <tr>
            {weekdays.map((d) => {
              return <th>{d}</th>;
            })}
          </tr>
        </thead>
        <tbody class="preachjs-calendar--grid-body">
          {possibleDates.value.map((dateRow, rowIndex) => {
            return (
              <tr>
                {dateRow.map((dateItem, colIndex) => {
                  if (dateItem.previousMonth || dateItem.nextMonth) {
                    return (
                      <td
                        role="gridcell"
                        data-row={rowIndex}
                        data-col={colIndex}
                        aria-disabled="true"
                        class="preachjs-calendar--grid-cell"
                      >
                        <button style={{ flex: 1 }} disabled={true}>
                          {dateItem.date.getDate()}
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td
                      data-row={rowIndex}
                      data-col={colIndex}
                      role="gridcell"
                      class="preachjs-calendar--grid-cell"
                    >
                      <button
                        onClick={() => {
                          onSelect(dateItem.date);
                        }}
                        aria-label={formatToReadableDate(
                          dateItem.date,
                          undefined
                        )}
                      >
                        {dateItem.date.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
