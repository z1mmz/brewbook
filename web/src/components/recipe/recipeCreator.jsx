import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import useRecipe from "../../hooks/useRecipe";
import useBeans from "../../hooks/useBeans";
import LoginContext from "../../contexts/loginContext";
import LexicalRecipeEditor from "./lexicalEditor";
import { normalizeDescription } from "./markdownUtils";

const emptyStep = () => ({ title: "", notes: "", timeSec: "", waterMl: "" });
const stepToForm = (step) => ({
  title: step.title ?? "",
  notes: step.notes ?? "",
  timeSec: step.timeSec !== undefined ? String(step.timeSec) : "",
  waterMl: step.waterMl !== undefined ? String(step.waterMl) : "",
});

export default function RecipeCreator() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { recipe, isLoading, isError, createRecipe, updateRecipe } = useRecipe(id);
  const { loggedInUser } = useContext(LoginContext);
  const { beans } = useBeans();
  const [title, setTitle] = useState("");
  const [grind, setGrind] = useState("");
  const [beanId, setBeanId] = useState("");
  const [water, setWater] = useState("");
  const [type, setType] = useState("pour_over");
  const [description, setDescription] = useState("");
  const [dose, setDose] = useState("");
  const [iced, setIced] = useState(false);
  const [steps, setSteps] = useState([emptyStep()]);
  const [submitError, setSubmitError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isEditMode && recipe?.title) {
      setTitle(recipe.title ?? "");
      setGrind(recipe.grind ?? "");
      setWater(recipe.water !== undefined ? String(recipe.water) : "");
      setType(recipe.type ?? "pour_over");
      setDescription(normalizeDescription(recipe.description));
      setDose(recipe.dose !== undefined ? String(recipe.dose) : "");
      setSteps(Array.isArray(recipe.steps) && recipe.steps.length ? recipe.steps.map(stepToForm) : [emptyStep()]);
      setBeanId(recipe.bean?.id ?? "");
      setIced(recipe.iced ?? false);
    }
  }, [isEditMode, recipe]);

  const errors = useMemo(() => {
    const result = {};
    if (!title.trim()) result.title = "Give your recipe a title.";
    if (!grind.trim()) result.grind = "Add a grind size.";
    if (!water || Number(water) <= 0) result.water = "Enter total water in millilitres.";
    if (!dose || Number(dose) <= 0) result.dose = "Enter the coffee amount in grams.";
    const stepErrors = steps.map((step) => {
      const error = {};
      if (!step.title.trim()) error.title = "Add a step name.";
      if (step.timeSec !== "" && (Number.isNaN(Number(step.timeSec)) || Number(step.timeSec) < 0)) error.timeSec = "Use zero or more seconds.";
      if (step.waterMl !== "" && (Number.isNaN(Number(step.waterMl)) || Number(step.waterMl) < 0)) error.waterMl = "Use zero or more millilitres.";
      return error;
    });
    if (stepErrors.some((step) => Object.keys(step).length)) result.steps = stepErrors;
    return result;
  }, [title, grind, water, dose, steps]);

  function updateStep(index, patch) {
    setSteps((current) => current.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step));
  }

  function submit(event) {
    event.preventDefault();
    setHasSubmitted(true);
    setSubmitError(null);
    if (Object.keys(errors).length) {
      setSubmitError("Please complete the highlighted fields before publishing.");
      return;
    }
    const recipeData = {
      title: title.trim(), grind: grind.trim(), water: Number(water), dose: Number(dose), type,
      description: description.trim(), iced, bean: beanId || null,
      steps: steps.map((step) => ({
        title: step.title.trim(),
        ...(step.notes.trim() ? { notes: step.notes.trim() } : {}),
        ...(step.timeSec !== "" ? { timeSec: Number(step.timeSec) } : {}),
        ...(step.waterMl !== "" ? { waterMl: Number(step.waterMl) } : {}),
      })),
    };
    if (isEditMode) updateRecipe(id, recipeData);
    else createRecipe(recipeData);
  }

  const shownErrors = hasSubmitted ? errors : {};
  const stepWaterTotal = steps.reduce((total, step) => total + (Number(step.waterMl) || 0), 0);

  if (isEditMode && !loggedInUser) {
    return (
      <VStack gap={4} align="center" mt={8}>
        <Heading>Edit recipe</Heading>
        <Text>Please log in to edit this recipe.</Text>
        <Button onClick={() => navigate("/login")} colorScheme="blue">
          Log In
        </Button>
      </VStack>
    );
  }

  if (isEditMode && isLoading) {
    return <div className="recipe-loading">Loading recipe…</div>;
  }

  if (isEditMode && (isError || !recipe)) {
    return <div className="recipe-loading">Recipe not found.</div>;
  }

  const ownerId = recipe?.user?.id ?? recipe?.user?._id;
  const isOwner =
    ownerId != null &&
    loggedInUser?.id != null &&
    String(ownerId) === String(loggedInUser.id);

  if (isEditMode && !isOwner) {
    return (
      <VStack gap={4} align="center" mt={8}>
        <Heading>Not allowed</Heading>
        <Text>You can only edit recipes you created.</Text>
        <Button asChild colorScheme="blue">
          <Link to={`/recipes/${id}`}>Back to recipe</Link>
        </Button>
      </VStack>
    );
  }

  return (
    <form className="recipe-editor" onSubmit={submit}>
      <header className="editor-header">
        <p className="eyebrow">{isEditMode ? "Edit story" : "New recipe"}</p>
        <input className="recipe-title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Name your brew" aria-label="Recipe title" />
        {shownErrors.title && <div className="field-error">{shownErrors.title}</div>}
        <p className="editor-subtitle">Share the method, details, and little choices that make this cup yours.</p>
      </header>

      <div className="recipe-editor-layout">
        <main className="recipe-editor-main">
          <section className="editor-card description-card">
            <div className="section-heading"><div><p className="eyebrow">The story</p><h2>About this recipe</h2></div><span className="section-number">01</span></div>
            <LexicalRecipeEditor value={description} onChange={setDescription} />
          </section>

          <section className="editor-card steps-card">
            <div className="section-heading"><div><p className="eyebrow">The method</p><h2>Brewing steps</h2></div><span className="section-number">02</span></div>
            <p className="section-help">Break the brew into clear, timed moments. Water and time are optional, but helpful.</p>
            <div className="steps-list">
              {steps.map((step, index) => {
                const stepError = shownErrors.steps?.[index] ?? {};
                return <article className="step-editor" key={index}>
                  <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="step-fields">
                    <div className="step-heading-row"><input className="step-title-input" value={step.title} onChange={(event) => updateStep(index, { title: event.target.value })} placeholder="Step title, e.g. Bloom" aria-label={`Step ${index + 1} title`} /><button type="button" className="text-button danger" onClick={() => setSteps((current) => current.length === 1 ? current : current.filter((_, i) => i !== index))} disabled={steps.length === 1}>Remove</button></div>
                    {stepError.title && <div className="field-error">{stepError.title}</div>}
                    <textarea value={step.notes} onChange={(event) => updateStep(index, { notes: event.target.value })} placeholder="What should the brewer do?" rows={3} />
                    <div className="step-meta-grid"><label>Time (seconds)<input value={step.timeSec} onChange={(event) => updateStep(index, { timeSec: event.target.value })} inputMode="numeric" placeholder="45" /></label><label>Water (ml)<input value={step.waterMl} onChange={(event) => updateStep(index, { waterMl: event.target.value })} inputMode="numeric" placeholder="60" /></label></div>
                    {(stepError.timeSec || stepError.waterMl) && <div className="field-error">{stepError.timeSec || stepError.waterMl}</div>}
                  </div>
                </article>;
              })}
            </div>
            <button type="button" className="secondary-button add-step-button" onClick={() => setSteps((current) => [...current, emptyStep()])}>+ Add another step</button>
          </section>
        </main>

        <aside className="recipe-editor-sidebar">
          <section className="editor-card details-card">
            <div className="section-heading"><div><p className="eyebrow">At a glance</p><h2>Brew details</h2></div><span className="section-number">03</span></div>
            <div className="details-fields"><label>Grind size<input value={grind} onChange={(event) => setGrind(event.target.value)} placeholder="Medium-fine" />{shownErrors.grind && <small className="field-error">{shownErrors.grind}</small>}</label><label>Total water<input value={water} onChange={(event) => setWater(event.target.value)} inputMode="numeric" placeholder="250" />{shownErrors.water && <small className="field-error">{shownErrors.water}</small>}</label><label>Coffee amount<input value={dose} onChange={(event) => setDose(event.target.value)} inputMode="numeric" placeholder="15" />{shownErrors.dose && <small className="field-error">{shownErrors.dose}</small>}</label></div>
            <div className="temperature-toggle"><span>Temperature</span><div role="group" aria-label="Temperature"><button type="button" className={!iced ? "selected" : ""} onClick={() => setIced(false)}>☕ Hot</button><button type="button" className={iced ? "selected" : ""} onClick={() => setIced(true)}>🧊 Iced</button></div></div>
            {loggedInUser && beans.length > 0 && <label>Beans used<select value={beanId} onChange={(event) => setBeanId(event.target.value)}><option value="">None selected</option>{beans.map((bean) => <option key={bean.id} value={bean.id}>{bean.name} — {bean.roaster}</option>)}</select></label>}
            <div className="water-summary">Step water <strong>{stepWaterTotal} ml</strong>{water ? <> of <strong>{water} ml</strong></> : null}</div>
          </section>
          {submitError && <div className="submit-error">{submitError}</div>}
          <button className="publish-button" type="submit">{isEditMode ? "Save changes" : "Publish recipe"}<span>→</span></button>
          <p className="save-note">You can always edit this recipe later.</p>
        </aside>
      </div>
    </form>
  );
}
