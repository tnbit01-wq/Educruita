# Component Documentation

## 📦 Common Components (`src/components/common/`)

### Button.jsx
Reusable button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `disabled`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

**Usage:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Card.jsx
Container component for content sections.

**Props:**
- `padding`: 'sm' | 'md' | 'lg' | 'none'
- `hover`: boolean (adds hover effect)
- `className`: string

**Usage:**
```jsx
<Card padding="md" hover>
  <h2>Card Content</h2>
</Card>
```

### Badge.jsx
Status indicator component.

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
- `size`: 'sm' | 'md' | 'lg'

**Usage:**
```jsx
<Badge variant="success">Active</Badge>
```

### LoadingSpinner.jsx
Loading indicator.

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `centered`: boolean

**Usage:**
```jsx
<LoadingSpinner size="md" centered />
```

### EmptyState.jsx
Display when no data is available.

**Props:**
- `icon`: React element
- `title`: string
- `description`: string
- `action`: React element

**Usage:**
```jsx
<EmptyState
  icon={<InboxIcon className="h-16 w-16" />}
  title="No results found"
  description="Try adjusting your filters"
  action={<Button>Clear Filters</Button>}
/>
```

### Alert.jsx
Notification/message component.

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: string
- `message`: string
- `onClose`: function

**Usage:**
```jsx
<Alert
  type="success"
  title="Success!"
  message="Your changes have been saved"
  onClose={() => setShow(false)}
/>
```

### ProgressBar.jsx
Progress indicator.

**Props:**
- `percentage`: number (0-100)
- `showLabel`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'blue' | 'green' | 'red' | 'yellow' | 'purple'

**Usage:**
```jsx
<ProgressBar percentage={75} color="blue" showLabel />
```

## 📝 Form Components (`src/components/forms/`)

### InputField.jsx
Text input with label and validation.

**Props:**
- `label`: string
- `type`: string
- `name`: string
- `value`: string
- `onChange`: function
- `placeholder`: string
- `error`: string
- `required`: boolean
- `disabled`: boolean
- `icon`: React element
- `helperText`: string

**Usage:**
```jsx
<InputField
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  icon={<EnvelopeIcon className="h-5 w-5" />}
/>
```

### SelectField.jsx
Dropdown select component.

**Props:**
- `label`: string
- `name`: string
- `value`: string
- `onChange`: function
- `options`: array of { value, label }
- `error`: string
- `required`: boolean
- `disabled`: boolean
- `placeholder`: string

**Usage:**
```jsx
<SelectField
  label="Job Type"
  name="jobType"
  value={jobType}
  onChange={(e) => setJobType(e.target.value)}
  options={[
    { value: 'fulltime', label: 'Full-time' },
    { value: 'parttime', label: 'Part-time' }
  ]}
  required
/>
```

### TextAreaField.jsx
Multi-line text input.

**Props:**
- `label`: string
- `name`: string
- `value`: string
- `onChange`: function
- `placeholder`: string
- `error`: string
- `required`: boolean
- `disabled`: boolean
- `rows`: number
- `helperText`: string

**Usage:**
```jsx
<TextAreaField
  label="Description"
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

### Checkbox.jsx
Checkbox input.

**Props:**
- `label`: string
- `name`: string
- `checked`: boolean
- `onChange`: function
- `disabled`: boolean

**Usage:**
```jsx
<Checkbox
  label="Remember me"
  name="remember"
  checked={remember}
  onChange={(e) => setRemember(e.target.checked)}
/>
```

## 🪟 Modal Components (`src/components/modals/`)

### Modal.jsx
Dialog overlay component.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `footer`: React element
- `children`: React elements

**Usage:**
```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  size="md"
  footer={
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  }
>
  <p>Are you sure you want to continue?</p>
</Modal>
```

## 📊 Table Components (`src/components/tables/`)

### Table.jsx
Data table component.

**Props:**
- `columns`: array of { header, accessor, render }
- `data`: array of objects
- `onRowClick`: function

**Usage:**
```jsx
<Table
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant="success">{row.status}</Badge>
    }
  ]}
  data={users}
  onRowClick={(row) => handleRowClick(row)}
/>
```

## 🏗️ Layout Components (`src/layouts/`)

### CandidateLayout.jsx
Layout wrapper for candidate pages with sidebar and header.

**Features:**
- Responsive sidebar (mobile hamburger)
- User profile display
- Navigation menu
- Notification bell
- Logout button

### EmployerLayout.jsx
Layout wrapper for employer pages.

**Features:**
- Purple theme
- Company branding display
- Job-focused navigation
- Same responsive behavior

### AdminLayout.jsx
Layout wrapper for admin pages.

**Features:**
- Green theme
- Moderation-focused navigation
- Admin-specific tools

### SuperAdminLayout.jsx
Layout wrapper for super admin pages.

**Features:**
- Dark indigo gradient theme
- System-level navigation
- Analytics and configuration access

## 📄 Page Components

### Authentication Pages (`src/pages/auth/`)

#### Login.jsx
- Role selector for prototype
- Email/password inputs
- Remember me checkbox
- Forgot password link
- Registration link

#### Register.jsx
- Two-step OTP verification
- Candidate-only registration
- Form validation UI

#### ForgotPassword.jsx
- Email input
- Success message display

#### ResetPassword.jsx
- New password input
- Confirm password
- Password strength validation

### Candidate Pages (`src/pages/candidate/`)

#### CandidateDashboard.jsx
- Profile completion widget
- Stats cards
- Recommended jobs list
- Recent applications
- Notification banners

#### CandidateProfile.jsx
- Tabbed interface
- Personal info form
- Education with CGPA
- Experience timeline
- Skills with proficiency sliders
- Projects portfolio

#### CandidateResume.jsx
- Template selector
- Resume preview modal
- Version management
- Download buttons

#### CandidateJobs.jsx
- Search bar
- Advanced filters panel
- Job listing cards
- Job detail modal
- One-click apply

#### CandidateApplications.jsx
- Application status cards
- Timeline modal
- Status badges
- Progress tracking

#### CandidateBGV.jsx
- Document upload UI
- Verification status
- Progress tracking
- Guidelines section

### Employer Pages (`src/pages/employer/`)

#### EmployerDashboard.jsx
- Job statistics
- Active jobs list
- Recent applicants
- Shortlisted candidates
- Quick actions

#### EmployerJobs.jsx
- Create job modal
- Active/closed tabs
- Job listing with controls
- Edit/delete actions

### Admin Pages (`src/pages/admin/`)

#### AdminDashboard.jsx
- Pending approvals
- Platform statistics
- Moderation queue
- Quick approve/reject

### Super Admin Pages (`src/pages/superadmin/`)

#### SuperAdminDashboard.jsx
- Platform metrics with trends
- Recent activity feed
- Quick actions
- Chart placeholders

## 🎨 Styling Conventions

### Tailwind Classes Used
- **Spacing**: p-4, m-6, gap-4
- **Colors**: bg-blue-600, text-gray-900
- **Sizing**: h-6, w-6, max-w-md
- **Flexbox**: flex, items-center, justify-between
- **Grid**: grid, grid-cols-2, gap-4
- **Responsive**: md:, lg:, xl:

### Color Palette
- **Blue**: Primary (Candidate)
- **Purple**: Employer
- **Green**: Admin
- **Indigo**: Super Admin
- **Red**: Danger/Error
- **Yellow**: Warning/Pending
- **Gray**: Neutral

## 🔄 State Management

All components use React useState for local state:
```jsx
const [value, setValue] = useState(initialValue);
```

For global state (when adding backend):
- Consider React Context
- Or state management library (Redux, Zustand)

## 🧪 Testing Recommendations

### Unit Tests
Test individual components:
```javascript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Tests
Test page flows:
- Login → Dashboard navigation
- Job search → Apply flow
- Profile edit → Save

### E2E Tests (Cypress)
Full user journeys across roles.

## 📚 Additional Resources

- Component props follow React conventions
- All components are functional components with hooks
- Tailwind classes are utility-first
- Icons from @heroicons/react/24/outline

---

**Last Updated**: February 2, 2026
