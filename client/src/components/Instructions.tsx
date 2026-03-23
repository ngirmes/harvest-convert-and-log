export default function Instructions() {
  return (
    <p>
      ### Quick Guide: Using the Time Logger **1. Create a Project** * Navigate
      to the **Projects** section. * Click **Create Project**. * Enter a name
      for the project you want to track your work under. **2. Add Tasks to the
      Project** * Open the project you created. * Add the tasks associated with
      that project (for example: *Research*, *Documentation*, *Field Work*,
      etc.). * Tasks act as **categories** that the system will try to match
      your work against. **3. Enter Your Work Description** * When you perform
      work, write a short description of what you did in the **work description
      field**. * Try to be reasonably descriptive so the system has enough
      context to match the task. Example: * “Updated database schema and wrote
      migration script” * “Met with client to review design changes” **4. Run
      the Matcher** * Click **Run Matcher**. * The system uses **embedding-based
      matching** to compare your description with the tasks defined in the
      project. * It will suggest the task that best matches the context of your
      description. **5. Review the Suggested Match** * Check the suggested task.
      * If the match looks correct, proceed as normal. * If not, you can
      manually choose the task that best represents your work. --- ### Important
      Note The matcher uses **context-based semantic similarity**, not simple
      keyword matching. Because of this, the suggested task may occasionally
      differ from what you personally expect. Always review the result and
      adjust it if necessary.
    </p>
  );
}
