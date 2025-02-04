import './ParseFeedback.css'

const parseFeedback = (feedbackText) => {
  if (!feedbackText) return null;

  const GoodPoint = feedbackText.match(/1\. 잘한 점:\s*(.*?)(?=\n2\. 보완할 점:|\Z)/s);
  const BadPoint = feedbackText.match(/2\. 보완할 점:\s*(.*?)(?=\n3\. 보완된 대본 예시:|\Z)/s);
  const improvedScript = feedbackText.match(/3\. 보완된 대본 예시:\s*(.*)/s);

  const extractList = (text) => {
    return text
      ? text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("-"))
          .map((line, index) => <li key={index}>{line.substring(1).trim()}</li>)
      : null;
  };

  return (
    <div className="parsing-feedback">
      {GoodPoint && (
        <div>
          <div className='feedback-script-title'>
            😄 잘한 점
          </div>
          <ul>{extractList(GoodPoint[1])}</ul>
        </div>
      )}

      {BadPoint && (
        <div>
          <div className='feedback-script-title'>
            🤔 보완할 점
          </div>
          <ul>{extractList(BadPoint[1])}</ul>
        </div>
      )}

      {improvedScript && (
        <div>
          <div className='feedback-script-title'>
            📄 보완된 대본 예시
          </div>
          <blockquote>{improvedScript[1]}</blockquote>
        </div>
      )}
    </div>
  );
};

export default parseFeedback;