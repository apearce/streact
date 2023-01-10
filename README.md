# streact

Sometimes you need to inject a string of text containing HTML into your React app. This may come from a CMS or a localization config file or some other source. React provides an intentionally rather cumbersome way of doing this with [`dangerouslySetInnerHTML`](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml). The problem with `dangerouslySetInnerHTML` is you must use it on an HTML element and sometimes that is not what you want. 

`streact` lets you convert strings comtaining HTML into valid React code that you can use anywhere. You can use it directly as a child of a component or pass it as a prop, no HTML wrapper required.

```jsx
<SomeComponent>
  {streact("A <em>string</em> with <abbr title='HyperText Markup Language'>HTML</abbr>!")}
</SomeComponent>
```
```jsx
<SomeComponent
  someProp={streact("Styles work <em style='background-color: #0f0; color: #f00;'>too.</em>")}
/>
```

## HTML Attributes
Most attributes in your HTML should just work, however there are some where the name or case type is different between HTML and React. HTML attributes should be all lower case while [React expects camel case](https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes). HTML uses `class` while React expects `className`. HTML uses `for` while React expects `htmlFor`.

`streact` will convert `class` to `className` but the rest are up to you. You can pass an `options` argument to `streact` which is an object with an `attributes` property. This takes a object with a mapping of the HTML attribute name to the React attribute name.

```jsx
{streact("<a href='https://example.com' tabindex='0'>Click Me</a>", {
    attributes: {
        tabindex: 'tabIndex'
    }
})}
```
The value for the React propert name can also be a function which will get passed the HTML attribute name and value. It should return an object with the attribute name and value. This is useful for Boolean attributes.

```jsx
{streact("You can't <button disabled>Click Me</button> because I'm disabled", {
    attributes: {
        disabled: () => ({ disabled: true })
    }
})}
```

## Replacements
`streact` also supports string replacements. Just include a `replacements` object in the `options` object with the string(s) to replace and the new value(s). The replacement string can be anything you want.

```jsx
{streact("<a href='$url' tabindex='0'>LINK_TEXT</a>", {
    attributes: {
        tabindex: 'tabIndex'
    },
    replacements: {
        LINK_TEXT: 'Click Me',
        $url: 'https://example.com'
    }
})}
```

## Sanitization
`streact` does not do any sanitization of the strings it is converting. It's always a good idea to use something like [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize any external HTML before injecting it into your code.
After all, there is a reason the official way of injecting strings of HTML into a React component is called `dangerouslySetInnerHTML`: It can be dangerous!