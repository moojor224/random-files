function Doc({ name, usage, result, resultClass = "javascript" }) {
    return (
        <>
            <details>
                <summary><h3>{name}</h3></summary>
                <span>Usage</span><br />
                <code className="javascript">{usage}</code>
                <span>Result</span><br />
                <code className={resultClass}>{result}</code>
            </details>
            <br />
        </>
    );
}

export default function Docs({ }) {
    return (
        <div>
            <Doc
                name="waitForKeyElements"
            />
        </div>
    );
}