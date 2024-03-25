import { useSignal, useComputed } from "@preact/signals";
import { useRef } from "preact/hooks";
import {
  getWeekdayList,
  generateListOfDaysForMonthAndYear,
  getMonthAndYearFromDate,
  formatToReadableDate,
} from "./utils";

export function Calendar({
  value = new Date(),
  mode = "single",
  onSelect = () => {},
  locale = "en-gb",
  weekdayFormat = "short",
  arrowLeft: ArrowLeft = () => <>&lt;</>,
  arrowRight: ArrowRight = () => <>&gt;</>,
}) {
  const refRange = useRef(Array.isArray(value) ? value : []);
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
          if (mode !== "single") return;
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
                  const isDateActive =
                    (mode == "single" &&
                      !Array.isArray(value) &&
                      dateItem.date.getTime() === value.getTime()) ||
                    false;

                  let isRangeStart;
                  let isRangeEnd;
                  let isInRange;

                  if (Array.isArray(value) && mode == "range") {
                    isRangeStart =
                      value[0] &&
                      dateItem.date.getTime() === value[0].getTime();
                    isRangeEnd =
                      value[1] &&
                      dateItem.date.getTime() === value[1].getTime();
                    isInRange =
                      value[0] &&
                      value[1] &&
                      dateItem.date.getTime() > value[0].getTime() &&
                      dateItem.date.getTime() < value[1].getTime();
                  }

                  if (dateItem.previousMonth || dateItem.nextMonth) {
                    return (
                      <td
                        role="gridcell"
                        data-row={rowIndex}
                        data-col={colIndex}
                        aria-disabled="true"
                        class={`preachjs-calendar--grid-cell
                          ${isDateActive ? "active" : ""}
                          ${
                            isRangeStart
                              ? "preachjs-calendar--grid-cell-start"
                              : ""
                          }
                          ${
                            isInRange
                              ? "preachjs-calendar--grid-cell-in-range"
                              : ""
                          }
                          ${
                            isRangeEnd ? "preachjs-calendar--grid-cell-end" : ""
                          }
                        `}
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
                      class={[
                        "preachjs-calendar--grid-cell",
                        isDateActive && "active",
                        isRangeStart && "preachjs-calendar--grid-cell-start",
                        isInRange && "preachjs-calendar--grid-cell-in-range",
                        isRangeEnd && "preachjs-calendar--grid-cell-end",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <button
                        onClick={() => {
                          if (mode == "single") {
                            onSelect(dateItem.date);
                            return;
                          }
                          if (mode == "range") {
                            refRange.current.push(dateItem.date);
                            if (refRange.current.length == 2) {
                              const selection = refRange.current.slice();
                              refRange.current = [];
                              onSelect(
                                selection.sort(
                                  (x, y) => x.getTime() > y.getTime()
                                )
                              );
                            }
                          }
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
