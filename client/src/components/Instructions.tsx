export default function Instructions() {
  return (
    <>
      <h2>Quick Guide: Using the Time Logger</h2>

      <h3>1. Create a Project</h3>
      <ul>
        <li>
          Click <strong>Create Project</strong>.
        </li>
        <li>
          Enter a name for the project you want to track your work under
          (suggested to use same name as in Harvest).
        </li>
      </ul>

      <h3>2. Add Tasks to the Project</h3>
      <ul>
        <li>
          Add the tasks associated with that project (for example:{" "}
          <em>1: Research</em>, <em>2: Documentation</em>,{" "}
          <em>3: Field Work</em>, etc.).
        </li>
        <li>
          Tasks act as <strong>categories</strong> that the system will try to
          match your work against.
        </li>
      </ul>

      <h3>3. Enter Your Work Description</h3>
      <ul>
        <li>
          When you perform work, write a short description of what you did in
          the <strong>work description field</strong>.
        </li>
        <li>
          Try to be reasonably descriptive so the system has enough context to
          match the task.
        </li>
      </ul>

      <p>
        <strong>Examples:</strong>
      </p>
      <ul>
        <li>“Updated database schema and wrote migration script”</li>
        <li>“Met with client to review design changes”</li>
      </ul>

      <h3>4. Run the Matcher</h3>
      <ul>
        <li>
          Click <strong>Run Matcher</strong>.
        </li>
        <li>
          The system uses <strong>embedding-based matching</strong> to compare
          your description with the tasks defined in the project.
        </li>
        <li>
          It will suggest the task that best matches the context of your
          description.
        </li>
      </ul>

      <h3>5. Review the Suggested Match</h3>
      <ul>
        <li>Check the suggested task.</li>
        <li>If the match looks correct, proceed as normal.</li>
        <li>
          If not, you can manually choose the task that best represents your
          work.
        </li>
      </ul>

      <h3>Important Note</h3>
      <p>
        The matcher uses <strong>context-based semantic similarity</strong>, not
        simple keyword matching. Because of this, the suggested task may
        occasionally differ from what you personally expect. Always review the
        result and adjust it if necessary.
      </p>
    </>
  );
}
