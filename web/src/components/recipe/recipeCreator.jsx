import { useMemo, useState } from "react";
import useRecipe from "../../hooks/useRecipe";

const emptyStep = () => ({
  title: "",
  notes: "",
  timeSec: "",
  waterMl: "",
});

export default function RecipeCreator() {
  const [title, setTitle] = useState("");
  const [grind, setGrind] = useState("");
  const [water, setWater] = useState("");

  const [type, setType] = useState("pour_over");
  const [description, setDescription] = useState("");
  const [dose, setDose] = useState("");
  const [steps, setSteps] = useState([emptyStep()]);
  const [submitError, setSubmitError] = useState(null);

  // ✅ new flag
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { createRecipe } = useRecipe();

  const errors = useMemo(() => {
    const e = {};

    if (!title.trim()) e.title = "Recipe title is required";
    if (!grind.trim()) e.grindSize = "Grind size is required";

    const waterNum = Number(water);
    if (!water || Number.isNaN(waterNum) || waterNum <= 0) {
      e.waterTotalMl = "Total water (ml) must be a positive number";
    }

    const coffeeNum = Number(dose);
    if (!dose || Number.isNaN(coffeeNum) || coffeeNum <= 0) {
      e.coffeeGrams = "Coffee (g) must be a positive number";
    }

    const stepErrors = steps.map((s) => {
      const se = {};
      if (!s.title.trim()) se.title = "Step title is required";

      if (s.timeSec !== "") {
        const t = Number(s.timeSec);
        if (Number.isNaN(t) || t < 0) se.timeSec = "Time must be >= 0";
      }

      if (s.waterMl !== "") {
        const w = Number(s.waterMl);
        if (Number.isNaN(w) || w < 0) se.waterMl = "Water must be >= 0";
      }

      return se;
    });

    if (stepErrors.some((se) => Object.keys(se).length > 0)) {
      e.steps = stepErrors;
    }

    return e;
  }, [title, grind, water, dose, steps]);

  const isValid = Object.keys(errors).length === 0;

  // only show errors after submit attempt
  const showErrors = hasSubmitted;
  const shownErrors = showErrors ? errors : {};

  function updateStep(index, patch) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  }

  function addStep() {
    setSteps((prev) => [...prev, emptyStep()]);
  }

  function removeStep(index) {
    setSteps((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setHasSubmitted(true);
    setSubmitError(null);

    if (!isValid) {
      setSubmitError("Please fix the errors above before submitting.");
      return;
    }

    const recipe = {
      title: title.trim(),
      grind: grind.trim(),
      water: Number(water),
      dose: Number(dose),
      type: type,
      description: description.trim(),
      steps: steps.map((s) => ({
        title: s.title.trim(),
        ...(s.notes === "" ? {} : { notes: s.notes.trim() }),
        ...(s.timeSec === "" ? {} : { timeSec: Number(s.timeSec) }),
        ...(s.waterMl === "" ? {} : { waterMl: Number(s.waterMl) }),
      })),
    };

    createRecipe(recipe);
  }

  const stepWaterSum = useMemo(() => {
    return steps.reduce(
      (acc, s) => acc + (s.waterMl === "" ? 0 : Number(s.waterMl) || 0),
      0
    );
  }, [steps]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 840, display: "grid", gap: 16 }}
    >
      <h2>Create a coffee recipe</h2>

      <section
        style={{
          display: "grid",
          gap: 12,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <label>
            Recipe title *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., V60 15g - light roast"
              style={{ width: "100%" }}
            />
          </label>
          {shownErrors.title && (
            <div style={{ color: "crimson" }}>{shownErrors.title}</div>
          )}
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label>
            Grind size *
            <input
              value={grind}
              onChange={(e) => setGrind(e.target.value)}
              placeholder="e.g., Medium-fine / 18 clicks"
              style={{ width: "100%" }}
            />
          </label>
          {shownErrors.grindSize && (
            <div style={{ color: "crimson" }}>{shownErrors.grindSize}</div>
          )}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>
            Description *
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Iced pour-over for hot days"
              style={{ width: "100%" }}
            />
          </label>
          {shownErrors.grindSize && (
            <div style={{ color: "crimson" }}>{shownErrors.grindSize}</div>
          )}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label>
              Total water (ml) *
              <input
                value={water}
                onChange={(e) => setWater(e.target.value)}
                inputMode="numeric"
                placeholder="e.g., 250"
                style={{ width: "100%" }}
              />
            </label>
            {shownErrors.waterTotalMl && (
              <div style={{ color: "crimson" }}>{shownErrors.waterTotalMl}</div>
            )}
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>
              Coffee (g) *
              <input
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                inputMode="numeric"
                placeholder="e.g., 15"
                style={{ width: "100%" }}
              />
            </label>
            {shownErrors.coffeeGrams && (
              <div style={{ color: "crimson" }}>{shownErrors.coffeeGrams}</div>
            )}
          </div>
        </div>

        <div style={{ fontSize: 14, opacity: 0.8 }}>
          Step water total (optional fields): <strong>{stepWaterSum}</strong> ml
          {water && (
            <>
              {" "}
              / target <strong>{water}</strong> ml
            </>
          )}
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0 }}>Steps</h3>
        </div>

        {steps.map((step, idx) => {
          const stepErr = shownErrors.steps?.[idx] ?? {};
          return (
            <div
              key={idx}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>Step {idx + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  disabled={steps.length === 1}
                >
                  Remove
                </button>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label>
                  Title *
                  <input
                    value={step.title}
                    onChange={(e) => updateStep(idx, { title: e.target.value })}
                    placeholder="e.g., Bloom"
                    style={{ width: "100%" }}
                  />
                </label>
                {stepErr.title && (
                  <div style={{ color: "crimson" }}>{stepErr.title}</div>
                )}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label>
                  Notes
                  <textarea
                    value={step.notes}
                    onChange={(e) => updateStep(idx, { notes: e.target.value })}
                    placeholder="Instructions for the brewer.."
                    style={{ width: "100%", minHeight: 70 }}
                  />
                </label>
                {stepErr.notes && (
                  <div style={{ color: "crimson" }}>{stepErr.notes}</div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <label>
                    Time (seconds) — optional
                    <input
                      value={step.timeSec}
                      onChange={(e) =>
                        updateStep(idx, { timeSec: e.target.value })
                      }
                      inputMode="numeric"
                      placeholder="e.g., 45"
                      style={{ width: "100%" }}
                    />
                  </label>
                  {stepErr.timeSec && (
                    <div style={{ color: "crimson" }}>{stepErr.timeSec}</div>
                  )}
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label>
                    Water (ml) — optional
                    <input
                      value={step.waterMl}
                      onChange={(e) =>
                        updateStep(idx, { waterMl: e.target.value })
                      }
                      inputMode="numeric"
                      placeholder="e.g., 50"
                      style={{ width: "100%" }}
                    />
                  </label>
                  {stepErr.waterMl && (
                    <div style={{ color: "crimson" }}>{stepErr.waterMl}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button type="button" onClick={addStep}>
          + Add step
        </button>

        {submitError && <div style={{ color: "crimson" }}>{submitError}</div>}

        {/* optional: keep enabled, let submit show errors */}
        <button type="submit">Save recipe</button>
      </section>
    </form>
  );
}
