export default function Instructions() {
  return (
    <div className="text-sm">
      <h3 className="bold"></h3>
      <p className="italic text-xsm">
        Important Note: The matcher uses{" "}
        <strong>context-based semantic similarity</strong>, not simple keyword
        matching. Because of this, the suggested task may occasionally differ
        from what you personally expect. Always review the result and adjust it
        if necessary.
      </p>
      <br />
      <h2 className="">Quick Guide: Using the Time Logger</h2>

      <br />
      <h3>1. Submit harvest credentials if necessary</h3>
      <ul className="list-disc list-inside pl-5">
        <li>
          Click <strong>Get Projects from Harvest</strong>.
        </li>
        <li>Select which project you'd like to log time for</li>
      </ul>
      <br />
      <h3>
        2. Enter your task notes for each entry you'd like to log separated by
        commas (equivalent to notes section of Harvest){" "}
      </h3>
      <ul className="list-disc list-inside pl-5">
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
      <ul className="list-disc list-inside pl-5">
        <li>“Updated database schema and wrote migration script”</li>
        <li>“Met with client to review design changes”</li>
      </ul>
      <br />
      <h3>3. Run the Matcher</h3>
      <ul className="list-disc list-inside pl-5">
        <li>
          Click <strong>Run Matcher</strong>.
        </li>
        <li>
          The system uses <strong>embedding-based matching</strong> to compare
          your description with the tasks defined in the project.
        </li>
        <li>It will then return the task that best matches each description</li>
        <li>
          Click <strong>See Logs</strong>
        </li>
      </ul>
      <br />
      <h3>4. Review the logs</h3>
      <ul className="list-disc list-inside pl-5">
        <li>Make sure the app has chosen appropriate tasks</li>
        <li>Enter the start and end times for each task</li>
        <li>Submit the time entries</li>
      </ul>
    </div>
  );
}
