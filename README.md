# Complaint to Action Converter – AI Agent

The Complaint to Action Converter is an AI-powered tool designed for civic authorities and community managers. It transforms unstructured, raw citizen complaints into categorized, prioritized, and actionable tasks. By leveraging advanced Large Language Models, it removes the manual overhead of sorting through reports, ensuring that urgent public health and safety issues are addressed immediately with a clear roadmap for resolution.

### Live Demo
[Live demo link here]

### Features
- **Intelligent Categorization**: Automatically identifies the nature of the complaint (e.g., Waste Management, Infrastructure, Public Safety).
- **Dynamic Priority Scoring**: Assigns High, Medium, or Low priority based on the urgency and impact described in the text.
- **Automated Action Synthesis**: Generates four precise, step-by-step actions required to resolve the issue.
- **Zero-Latency UI**: A responsive, three-column interface that provides immediate visual feedback during the analysis process.
- **Contextual Reasoning**: Provides a clear explanation for why a specific priority level was assigned.
- **Lightweight Architecture**: A single-file solution with no external dependencies or frameworks, making it easy to deploy and audit.

### How It Works
1. **Receive Complaint**: The user enters a raw description of a civic issue into the input panel.
2. **Understand & Analyze**: The AI Agent parses the text using Claude 3.5 Sonnet to understand the core problem.
3. **Classify & Prioritize**: The system detects the relevant department and evaluates the severity of the situation.
4. **Suggest Actions**: The model generates a numbered list of technical and administrative steps to fix the issue.
5. **Ready for Action**: The structured results are displayed, providing a "Ready to Act" blueprint for the relevant authorities.

### Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Google Gemini API (gemini-3-flash-preview)
- No frameworks, no dependencies, single file

### Setup
1. **Clone the Project**:
   ```bash
   git clone https://github.com/your-username/complaint-action-converter.git
   ```
2. **Configure API**:
   The application uses the `GEMINI_API_KEY` environment variable. In AI Studio, this is pre-configured.
3. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### API Configuration
The application is optimized for Google AI Studio. It uses the `@google/genai` SDK to communicate with the **Gemini 3.5 Flash** model. No manual key entry is required when running within the AI Studio environment.

### Advanced Features
- **Location Intelligence**: Integrated with the OpenStreetMap Nominatim API for one-click reverse geocoding.
- **Persistence Layer**: LocalStorage-based history tracking that maintains the last 50 submissions.
- **Auto-Escalation Engine**: A client-side logic layer that automatically upgrades priority to **Critical** if multiple similar complaints are detected in the same area within 30 days.

### Example Complaints to Try
- **Road Systems**: "Huge pothole on Oak Street right outside the elementary school. It's causing cars to swerve into the bike lane and was nearly hit by a bus this morning."
- **Water Supply**: "Brown, muddy water has been coming out of the taps in the 400 block of Maple Ave for three days. It smells like rust and we cannot cook or bathe."
- **Waste Management**: "Illegal dumping behind the main supermarket. About 20 old tires and several bags of construction debris have been left, attracting rats near the food storage area."
- **Electricity**: "Street lighting is completely out on the pedestrian bridge over the highway. It’s pitch black after 6 PM, and we’ve had three reports of muggings in the last week."
- **Encroachment**: "A new street vendor has set up a permanent wooden structure on the sidewalk at the corner of 5th and Main, completely blocking wheelchair access to the ramp."

### Screenshots
[Screenshot placeholder]

### License
MIT
