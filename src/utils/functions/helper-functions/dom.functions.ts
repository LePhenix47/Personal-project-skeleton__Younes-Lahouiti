
/**
 * Simpler version of `document.getElementsByClassName()`
 * Selects all elements with a given class name inside a given container or the whole document.
 *
 * @param {string} className - The class name of the elements to select.
 * @param {any} container - The parent element to search within.
 *
 * @returns {HTMLElement[]|[]} A collection of elements with the specified class name.
 */
export function selectByClass(
  className: string,
  container?: any
): HTMLElement[] | [] {
  const hasNoParentContainer: boolean = !container;
  if (hasNoParentContainer) {
    return Array.from(
      document.getElementsByClassName(className)
    ) as HTMLElement[];
  }

  /**
   * We check if it's a web component, they always have a hyphen in their tag name
   */
  const containerIsWebComponent: boolean = container?.tagName?.includes("-");

  if (containerIsWebComponent) {
    return Array.from(
      container.shadowRoot.getElementsByClassName(className)
    ) as HTMLElement[];
  }
  return Array.from(
    container.getElementsByClassName(className)
  ) as HTMLElement[];
}

/**
 * Simpler version of `document.getElementById()`
 * Selects an element with a given ID inside a given container or the whole document.
 *
 * @param {string} id - The ID of the element to select.
 * @param {any} container - The parent element to search within.
 *
 * @returns {HTMLElement} The element with the specified ID.
 */
export function selectById(id: string, container?: any): HTMLElement {
  const hasNoParentContainer: boolean = !container;
  if (hasNoParentContainer) {
    return document.getElementById(id);
  }

  /**
   * We check if it's a web component, they always have a hyphen in their tag name
   */
  const containerIsWebComponent: boolean = container?.tagName?.includes("-");

  if (containerIsWebComponent) {
    return container.shadowRoot.getElementById(id);
  }
  return container.getElementById(id);
}

/**
 * A simplified version of `document.querySelector()`
 *
 * @param {string} query - CSS query of the HTML Element to select
 * @param {any} container - HTML Element to select the query from
 *
 * @returns {HTMLElement} - The element selected or `null` if the element doesn't exist
 */

export function selectQuery(query: string, container?: any): HTMLElement {
  const hasNoParentContainer: boolean = !container;
  if (hasNoParentContainer) {
    return document.querySelector(query);
  }
  /**
   * We check if it's a web component, they always have a hyphen in their tag name
   */
  const containerIsWebComponent: boolean = container?.tagName?.includes("-");

  if (containerIsWebComponent) {
    return container.shadowRoot.querySelector(query);
  }

  return container.querySelector(query);
}

/**
 * A simplified version of `document.querySelectorAll()`
 *
 * @param {string} query - CSS query of the HTML Elements to select
 * @param {any} container - HTML Element to select the query from
 * @returns {HTMLElement[] | []} - An array with all the elements selected or `null` if the element doesn't exist
 */
export function selectQueryAll(
  query: string,
  container?: any
): HTMLElement[] | [] {
  const hasNoParentContainer: boolean = !container;
  if (hasNoParentContainer) {
    return Array.from(document.querySelectorAll(query));
  }

  const isWebComponent: boolean = container.tagName.includes("-");

  if (isWebComponent) {
    return Array.from(container.shadowRoot.querySelectorAll(query));
  }

  return Array.from(container.querySelectorAll(query));
}

/**
 * Function that returns an array containing all child nodes of an HTML element.
 *
 * @param {HTMLElement} elementOfReference The parent HTML element whose children to select.
 * @returns {HTMLElement[]} An array containing all child nodes of the parent element or null if the parent element has no children.
 */
export function getChildren(elementOfReference: any | null): HTMLElement[] {
  return Array.from(elementOfReference.children);
}

/**
 * Returns the parent element of a given element.
 * @param {HTMLElement} elementOfReference - The child element for which to find the parent.
 * @returns {HTMLElement} - The parent element of the child element, or null if the parent cannot be found.
 */
export function getParent(elementOfReference: HTMLElement): HTMLElement {
  return elementOfReference.parentElement;
}

/**
 * Returns the closest ancestor element of a given HTML element based on a CSS selector.
 *
 * @param {HTMLElement} elementOfReference - The HTML element of reference.
 * @param {string} cssSelector - The CSS selector to use to select the ancestor element. Default is an empty string.
 *
 * @returns {HTMLElement|null} The closest ancestor element that matches the CSS selector, or null if no ancestor element matches the selector.
 */

export function getAncestor(
  elementOfReference: HTMLElement,
  cssSelector: string
): HTMLElement | null {
  return elementOfReference.closest(cssSelector);
}

/**
 *Returns the host element of a web component given a reference element within it.
 *
 *@param {HTMLElement} elementOfReference - An element that is a child of the web component.
 *
 * @returns {ShadowRoot | null} - The host element of the web component.
 */

export function getComponentHost(
  elementOfReference: HTMLElement
): ShadowRoot | null {
  const rootNode: Node = elementOfReference.getRootNode();

  const elementIsInShadowRoot: boolean = rootNode instanceof ShadowRoot;
  if (elementIsInShadowRoot) {
    return rootNode as ShadowRoot;
  }
  return null;
}

/**
 * Returns the next sibling element of the specified element.
 *
 * @param {HTMLElement} elementOfReference - The reference element whose sibling to return.
 * @returns {any | null} The next sibling element, or null if there is none.
 */
export function getSibling(
  elementOfReference: HTMLElement
): HTMLElement | null {
  return elementOfReference.nextElementSibling as HTMLElement;
}

/**
 *
 * Returns an array of strings representing the classes of the specified element.
 *
 * @param {HTMLElement} elementOfReference - The element to retrieve class values from.
 *
 * @returns An array of strings representing the classes of the specified element.
 */
export function getClassListValues(elementOfReference: HTMLElement): string[] {
  return Array.from(elementOfReference.classList);
}

/**
 * Sets the value of a specified CSS property for the given HTML element.
 *
 * @param {string} property - The name of the style property to set.
 * @param {any} value - The value to set for the specified style property.
 * @param {any} [element=document.body] - The HTML element to set the style property for, ***NOT mandatory***.

* @returns {void}
 */
export function setStyleProperty(
  property: string,
  value: any,
  element: HTMLElement = document.body
): void {
  const stringifiedValue = value.toString();
  return element.style.setProperty(property, stringifiedValue);
}

/**
 * Appends a child element to a parent element
 *
 * @param {any} childElement - The child element to append to the parent element
 * @param {any} parentElement - The parent element to which the child element should be appended
 * @returns {HTMLElement} - The appended child element
 */
export function appendChildToParent(
  childElement: HTMLElement,
  parentElement: HTMLElement
): HTMLElement {
  return parentElement.appendChild(childElement);
}

/**
 * Replaces an old child element with a new child element in a given parent element
 * @param {any} parentElement - The parent element where the child will be replaced
 * @param {any} newChild - The new child element to be inserted
 * @param {any} oldChild - The old child element to be removed
 * @returns {void} - The replaced child element
 */
export function replaceChildInParent(
  parentElement: HTMLElement,
  newChild: HTMLElement,
  oldChild: HTMLElement
): void {
  oldChild.remove();
  appendChildToParent(newChild, parentElement);
}

/**
 * Adds or modifies an attribute to the given element
 *
 * @param {HTMLElement} element The element to add the attribute to
 * @param {string} property The name of the attribute to add
 * @param {any} value The value to set the attribute to
 */
export function modifyAttribute(
  property: string,
  value: any,
  element: HTMLElement
): void {
  element.setAttribute(property, value.toString());
}

/**
 * Retrieves the value of the specified attribute from the given element
 *
 * @param {string} attributeName - The name of the attribute to retrieve
 * @param {HTMLElement} element - The element from which to retrieve the attribute
 *
 * @returns {string} The value of the attribute
 */
export function getAttribute(
  attributeName: string,
  element: HTMLElement
): string {
  return element.getAttribute(attributeName);
}

/**
 * Removes an attribute from an element and sets a new attribute in its place.
 *
 * @param {HTMLElement} element - The element from which to remove the attribute.
 * @param {string} oldAttribute - The name of the attribute to remove.
 * @param {string} newAttribute - The name of the new attribute to set.
 */
export function replaceAttributeBy(
  element: HTMLElement,
  oldAttribute: string,
  newAttribute: string
) {
  element.removeAttribute(oldAttribute);
  element.setAttribute(newAttribute, "");
}

/**
 * Enables the specified element by removing the "disabled" attribute and setting the "enabled" attribute.
 *
 * @param {HTMLElement} element - The element to enable.
 */
export function enableElement(element: HTMLElement): void {
  replaceAttributeBy(element, "disabled", "enabled");
}

/**
 * Disables the specified element by removing the "enabled" attribute and setting the "disabled" attribute.
 *
 * @param {HTMLElement} element - The element to disable.
 */
export function disableElement(element: HTMLElement): void {
  replaceAttributeBy(element, "enabled", "disabled");
}

/**
 * Adds a class name to a given element's class list
 * @param {HTMLElement} element - The element to add the class to
 * @param {string} className - The class name to add
 *
 * @returns {void}
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * Removes a class name from a given element's class list
 * @param {HTMLElement} element - The element to remove the class from
 * @param {string} className - The class name to remove
 *
 * @returns {void}
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * Replaces an old class name with a new class name in a given element's class list
 * @param {HTMLElement} element - The element to replace the class name in
 * @param {string} oldClassName - The old class name to replace
 * @param {string} newClassName - The new class name to replace with
 *
 * @returns {void}
 */
export function replaceClass(
  element: HTMLElement,
  oldClassName: string,
  newClassName: string
): void {
  element.classList.replace(oldClassName, newClassName);
}

export function getSelectOptions(
  selectElement: HTMLSelectElement,
  valuesOnly: boolean = false
): any {
  const isNotSelectElement: boolean = selectElement.tagName !== "SELECT";
  if (isNotSelectElement) {
    throw new Error(
      "Error: Element passed in argument is not a <select multiple>"
    );
  }

  let selectedOptionsArray: HTMLOptionElement[] = Array.from(
    selectElement.selectedOptions
  );

  if (valuesOnly) {
    //@ts-ignore
    selectedOptionsArray = selectedOptionsArray.map(
      (option: HTMLOptionElement) => {
        return option.value;
      }
    );
  }

  return selectedOptionsArray;
}
