import { autoLinkEmailMatcher, autoLinkUrlMatcher } from "@lexical/link";

const linkAttributes = { rel: "noreferrer", target: "_blank" };

function withLinkAttributes(matcher) {
  return (text) => {
    const match = matcher(text);
    return match ? { ...match, attributes: linkAttributes } : null;
  };
}

export const recipeAutoLinkMatchers = [
  withLinkAttributes(autoLinkUrlMatcher),
  withLinkAttributes(autoLinkEmailMatcher),
];
