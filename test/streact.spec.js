/**
 * @jest-environment jsdom
 */

import * as React from "react";
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import streact from "../dist/index";

const TestComponent = (props) => (props.children);

test("Basic test", () => {
    const html = 'A test <em>string</em> with HTML!';

    const {container} = render(<TestComponent>{streact(html)}</TestComponent>);

    // screen.debug();

    expect(container).toContainHTML(html);
});

test("Test normal attribute", () => {
    const html = '"A <em>string</em> with <abbr title="HyperText Markup Language">HTML</abbr>!"';

    const {container} = render(<TestComponent>{streact(html)}</TestComponent>);
    
    expect(container).toContainHTML(html);
});

test("Test class attribute", () => {
    const html = '"A <em>string</em> with <abbr class="foo-bar" title="HyperText Markup Language">HTML</abbr>!"';

    const {container} = render(<TestComponent>{streact(html)}</TestComponent>);
    
    expect(container).toContainHTML(html);
});

test("Test basic attribute", () => {
    const html = 'A test <em>string</em> with <button tabindex="0"><abbr title="HyperText Markup Language">HTML</abbr></button>';

    const {container} = render(<TestComponent>{streact(html, {
        attributes: {
            tabindex: "tabIndex"
        }
    })}</TestComponent>);

    expect(container).toContainHTML(html);
});

test("Test functional attribute", () => {
    const html = 'A test <em>string</em> with <button disabled><abbr title="HyperText Markup Language">HTML</abbr></button>';

    const {container, getByRole} = render(<TestComponent>{streact(html, {
        attributes: {
            disabled: () => ({ disabled: true })
        }
    })}</TestComponent>);

    expect(container).toContainHTML(html);
    expect(getByRole('button')).toBeDisabled();
});

test("Test basic and functional attributes", () => {
    const html = 'A test <em>string</em> with <button disabled tabindex="0"><abbr title="HyperText Markup Language">HTML</abbr></button>';

    const {container, getByRole} = render(<TestComponent>{streact(html, {
        attributes: {
            disabled: () => ({ disabled: true }),
            tabindex: "tabIndex"
        }
    })}</TestComponent>);

    expect(container).toContainHTML(html);
    expect(getByRole('button')).toBeDisabled();
});

test("Test styles", () => {
    const html = 'A test <em style="background-color: lime; color: red;">string</em> with <button>HTML</button>';

    const {container} = render(<TestComponent>{streact(html)}</TestComponent>);

    expect(container).toContainHTML(html);
});

test("Test replacement", () => {
    const html = 'The price is <strong>$price</strong>';

    const {container} = render(<TestComponent>{streact(html, {
        replacements: {
            '$price': '$12.99'
        }
    })}</TestComponent>);
    
    expect(container).toContainHTML('The price is <strong>$12.99</strong>');
});

test("Test multiple replacements", () => {
    const html = '<a href="$url">LINK_TEXT</a>';

    const {container} = render(<TestComponent>{streact(html, {
        replacements: {
            LINK_TEXT: 'Click Me',
            $url: 'https://example.com'
        }
    })}</TestComponent>);
    
    expect(container).toContainHTML('<a href="https://example.com">Click Me</a>');
});

test("Test multiple replacements and attribute", () => {
    const html = '<a href="$url" tabindex="0">LINK_TEXT</a>';

    const {container} = render(<TestComponent>{streact(html, {
        attributes: {
            tabindex: "tabIndex"
        },
        replacements: {
            LINK_TEXT: 'Click Me',
            $url: 'https://example.com'
        }
    })}</TestComponent>);
    
    expect(container).toContainHTML('<a href="https://example.com" tabindex="0">Click Me</a>');
});

test("Test returning multiple attributes", () => {
    const html = '<a href="">Click Me</a>';

    const {container} = render(<TestComponent>{streact(html, {
        attributes: {
            href: () => ({
                href: 'https://example.com',
                tabIndex: "0"
            })
        }
    })}</TestComponent>);
    
    expect(container).toContainHTML('<a href="https://example.com" tabindex="0">Click Me</a>');
});

test("Test returning multiple attributes and a replacement", () => {
    const html = '<a href="">LINK_TEXT</a>';

    const {container} = render(<TestComponent>{streact(html, {
        attributes: {
            href: () => ({
                href: 'https://example.com',
                tabIndex: "0"
            })
        },
        replacements: {
            LINK_TEXT: 'Click Me'
        }
    })}</TestComponent>);
    
    expect(container).toContainHTML('<a href="https://example.com" tabindex="0">Click Me</a>');
});