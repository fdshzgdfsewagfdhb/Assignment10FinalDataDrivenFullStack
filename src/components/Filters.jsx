import Tag from "@/src/components/Tag.jsx";
import { STORY_GENRES, STORY_LENGTHS } from "@/src/lib/storyMeta.js";
import { randomData } from "@/src/lib/randomData.js";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;
            const optionLabel =
              typeof option === "object" ? option.label : option;
            return (
              <option value={optionValue} key={`${name}-${optionValue}`}>
                {optionValue === "" ? "All" : optionLabel}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            <p>Stories</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Genre"
            options={["", ...STORY_GENRES]}
            value={filters.genre}
            onChange={(event) => handleSelectionChange(event, "genre")}
            name="genre"
            icon="/food.svg"
          />

          <FilterSelect
            label="Author"
            options={["", ...randomData.storyAuthors]}
            value={filters.author}
            onChange={(event) => handleSelectionChange(event, "author")}
            name="author"
            icon="/location.svg"
          />

          <FilterSelect
            label="Length"
            options={[
              { value: "", label: "All" },
              ...STORY_LENGTHS.map((item) => ({
                value: String(item.value),
                label: item.label,
              })),
            ]}
            value={filters.length}
            onChange={(event) => handleSelectionChange(event, "length")}
            name="length"
            icon="/price.svg"
          />

          <FilterSelect
            label="Sort"
            options={["Rating", "Review"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  setFilters({
                    author: "",
                    genre: "",
                    length: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          if (type == "sort" || value == "") {
            return null;
          }
          const display =
            type === "length"
              ? STORY_LENGTHS.find((item) => String(item.value) === String(value))
                  ?.label || value
              : value;
          return (
            <Tag
              key={`${type}-${value}`}
              type={type}
              value={display}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}
