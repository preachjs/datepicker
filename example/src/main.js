import { signal } from "@preact/signals";
import { Calendar } from "../../src/index.js";
import { render } from "preact";
import "./main.css";

const selectedDate = signal();

const App = () => {
  return (
    <div class="cal-container">
      <Calendar
        locale="ban-id"
        value={selectedDate.value}
        onSelect={(value) => {
          selectedDate.value = value;
        }}
        weekdayFormat="narrow"
        arrowRight={() => {
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </svg>
          );
        }}
        arrowLeft={() => {
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 6l-6 6l6 6" />
            </svg>
          );
        }}
      />
      <div>
        <p class="selected-text">
          <strong class="header">
            Selected:{" "}
          </strong>
          {selectedDate.value
            ? new Date(selectedDate.value).toLocaleString()
            : "None"}
        </p>
      </div>
    </div>
  );
};

render(<App />, document.querySelector("#app"));
