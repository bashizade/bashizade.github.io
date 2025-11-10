(function () {
    const PROJECTS_PATH = 'data/projects.json';

    let projects = [];
    let isDarkModeInitialised = false;
    let hasPendingChanges = false;

    const els = {
        projectList: document.getElementById('project-list'),
        projectCount: document.getElementById('project-count'),
        projectForm: document.getElementById('project-form'),
        projectTitle: document.getElementById('project-title'),
        projectDescription: document.getElementById('project-description'),
        projectImage: document.getElementById('project-image'),
        projectScreenshot: document.getElementById('project-screenshot'),
        projectTags: document.getElementById('project-tags'),
        projectLive: document.getElementById('project-live'),
        projectRepo: document.getElementById('project-repo'),
        feedback: document.getElementById('feedback'),
        toggleTheme: document.getElementById('toggle-theme'),
        downloadJson: document.getElementById('download-json'),
        importJson: document.getElementById('import-json'),
        saveLocalJson: document.getElementById('save-local-json'),
        reloadLocal: document.getElementById('reload-local-json'),
        pendingIndicator: document.getElementById('pending-indicator')
    };

    init();

    function init() {
        bindEvents();
        ensureThemeSync();
        loadProjectsFromLocal();
        showFileProtocolWarningIfNeeded();
    }

    function bindEvents() {
        if (els.projectForm) {
            els.projectForm.addEventListener('submit', onAddProject);
        }

        if (els.projectList) {
            els.projectList.addEventListener('input', onProjectFieldChange);
            els.projectList.addEventListener('change', onProjectFieldChange);
            els.projectList.addEventListener('click', onProjectListClick);
        }

        if (els.toggleTheme) {
            els.toggleTheme.addEventListener('click', () => {
                if (typeof toggleDarkMode === 'function') {
                    toggleDarkMode();
                    isDarkModeInitialised = true;
                }
            });
        }

        if (els.downloadJson) {
            els.downloadJson.addEventListener('click', downloadProjectsJson);
        }

        if (els.importJson) {
            els.importJson.addEventListener('change', importProjectsFromFile);
        }

        if (els.saveLocalJson) {
            els.saveLocalJson.addEventListener('click', saveProjectsToLocalFile);
        }

        if (els.reloadLocal) {
            els.reloadLocal.addEventListener('click', () => {
                loadProjectsFromLocal();
            });
        }

        document.addEventListener('DOMContentLoaded', ensureThemeSync);
    }

    function ensureThemeSync() {
        if (!isDarkModeInitialised && typeof toggleDarkMode === 'function') {
            if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark');
            }
        }
    }

    function onAddProject(event) {
        event.preventDefault();

        const title = els.projectTitle.value.trim();
        const description = els.projectDescription.value.trim();
        const image = els.projectImage.value.trim();
        const screenshot = els.projectScreenshot.value.trim();
        const tagsInput = els.projectTags.value.trim();
        const liveUrl = els.projectLive.value.trim();
        const repoUrl = els.projectRepo.value.trim();

        if (!title || !description) {
            showFeedback('error', 'Title and description are required.');
            return;
        }

        const tags = tagsInput
            ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
            : [];

        projects.push({
            id: generateProjectId(title),
            title,
            description,
            image,
            screenshot,
            tags,
            liveUrl,
            repoUrl
        });

        markPendingChanges();
        renderProjects();
        els.projectForm.reset();
        showFeedback('success', 'Project added successfully.');
    }

    function onProjectFieldChange(event) {
        const target = event.target;
        const index = Number(target.dataset.index);
        const field = target.dataset.field;

        if (Number.isNaN(index) || !field || !projects[index]) {
            return;
        }

        if (field === 'tags') {
            projects[index].tags = target.value
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean);
        } else {
            projects[index][field] = target.value;
        }

        markPendingChanges();
    }

    function onProjectListClick(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (Number.isNaN(index) || !projects[index]) return;

        switch (action) {
            case 'remove':
                projects.splice(index, 1);
                renderProjects();
                markPendingChanges();
                showFeedback('success', 'Project removed.');
                break;
            case 'move-up':
                if (index > 0) {
                    [projects[index - 1], projects[index]] = [projects[index], projects[index - 1]];
                    renderProjects();
                    markPendingChanges();
                }
                break;
            case 'move-down':
                if (index < projects.length - 1) {
                    [projects[index + 1], projects[index]] = [projects[index], projects[index + 1]];
                    renderProjects();
                    markPendingChanges();
                }
                break;
            default:
                break;
        }
    }

    function renderProjects() {
        if (!els.projectList) return;

        els.projectList.innerHTML = '';

        if (!projects.length) {
            els.projectList.innerHTML = `
                <div class="text-center text-gray-400 border border-dashed border-gray-700 rounded-2xl p-10">
                    No projects have been added yet. Use the form on the left or import a JSON file to get started.
                </div>
            `;
        } else {
            projects.forEach((project, index) => {
                const card = document.createElement('div');
                card.className = 'bg-gray-950/40 border border-gray-800 rounded-2xl p-5 space-y-4';

                const header = document.createElement('div');
                header.className = 'flex flex-wrap items-center justify-between gap-3';

                const title = document.createElement('h3');
                title.className = 'text-lg font-semibold text-secondary-300';
                title.textContent = project.title || `Project ${index + 1}`;
                header.appendChild(title);

                const actions = document.createElement('div');
                actions.className = 'flex items-center gap-2';
                actions.innerHTML = `
                    <button class="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50" data-action="move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Move up</button>
                    <button class="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50" data-action="move-down" data-index="${index}" ${index === projects.length - 1 ? 'disabled' : ''}>Move down</button>
                    <button class="px-3 py-1 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition" data-action="remove" data-index="${index}">Remove</button>
                `;

                header.appendChild(actions);
                card.appendChild(header);

                card.appendChild(createProjectInput('ID (slug)', 'id', project.id || '', index, { placeholder: 'title-slug', dir: 'ltr' }));
                card.appendChild(createProjectInput('Title', 'title', project.title || '', index));
                card.appendChild(createProjectTextarea('Description', 'description', project.description || '', index));
                card.appendChild(createProjectInput('Image path', 'image', project.image || '', index, { dir: 'ltr' }));
                card.appendChild(createProjectInput('Screenshot path (hover)', 'screenshot', project.screenshot || '', index, { dir: 'ltr' }));
                card.appendChild(createProjectInput('Tags (comma separated)', 'tags', (project.tags || []).join(', '), index));
                card.appendChild(createProjectInput('Live URL', 'liveUrl', project.liveUrl || '', index, { dir: 'ltr', type: 'url' }));
                card.appendChild(createProjectInput('Repository URL', 'repoUrl', project.repoUrl || '', index, { dir: 'ltr', type: 'url' }));

                els.projectList.appendChild(card);
            });
        }

        updateProjectCount();
    }

    function createProjectInput(label, field, value, index, options = {}) {
        const wrapper = document.createElement('label');
        wrapper.className = 'block text-sm text-gray-300 space-y-2';

        const text = document.createElement('span');
        text.textContent = label;

        const input = document.createElement('input');
        input.className = 'w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500';
        input.value = value;
        input.dataset.field = field;
        input.dataset.index = index;
        input.placeholder = options.placeholder || '';
        input.dir = options.dir || 'ltr';
        input.type = options.type || 'text';

        wrapper.appendChild(text);
        wrapper.appendChild(input);

        return wrapper;
    }

    function createProjectTextarea(label, field, value, index) {
        const wrapper = document.createElement('label');
        wrapper.className = 'block text-sm text-gray-300 space-y-2';

        const text = document.createElement('span');
        text.textContent = label;

        const textarea = document.createElement('textarea');
        textarea.className = 'w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500';
        textarea.value = value;
        textarea.rows = 3;
        textarea.dataset.field = field;
        textarea.dataset.index = index;

        wrapper.appendChild(text);
        wrapper.appendChild(textarea);

        return wrapper;
    }

    function updateProjectCount() {
        if (els.projectCount) {
            els.projectCount.textContent = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
        }
    }

    function showFeedback(type, message) {
        if (!els.feedback || !message) return;

        els.feedback.classList.remove(
            'hidden',
            'bg-red-900/40',
            'bg-green-900/30',
            'bg-yellow-900/30',
            'border-red-700/60',
            'border-green-700/60',
            'border-yellow-700/60',
            'text-red-200',
            'text-green-200',
            'text-yellow-200'
        );

        switch (type) {
            case 'success':
                els.feedback.classList.add('bg-green-900/30', 'border', 'border-green-700/60', 'text-green-200');
                break;
            case 'error':
                els.feedback.classList.add('bg-red-900/40', 'border', 'border-red-700/60', 'text-red-200');
                break;
            default:
                els.feedback.classList.add('bg-yellow-900/30', 'border', 'border-yellow-700/60', 'text-yellow-200');
        }

        els.feedback.textContent = message;
        setTimeout(() => {
            els.feedback?.classList.add('hidden');
        }, 6000);
    }

    function downloadProjectsJson() {
        const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'projects.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showFeedback('success', 'projects.json downloaded successfully.');
    }

    async function saveProjectsToLocalFile() {
        if (!window.showSaveFilePicker) {
            showFeedback('error', 'Your browser does not support saving files directly. Use the download option instead.');
            return;
        }

        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'projects.json',
                types: [
                    {
                        description: 'JSON',
                        accept: { 'application/json': ['.json'] }
                    }
                ]
            });

            const writable = await handle.createWritable();
            await writable.write(JSON.stringify(projects, null, 2));
            await writable.close();
            showFeedback('success', 'Projects saved to file successfully.');
            clearPendingChanges();
        } catch (error) {
            if (error.name === 'AbortError') {
                showFeedback('info', 'Save cancelled.');
            } else {
                console.error('saveProjectsToLocalFile', error);
                showFeedback('error', 'Saving the file failed.');
            }
        }
    }

    async function loadProjectsFromLocal() {
        if (location.protocol === 'file:') {
            showFeedback('info', 'Direct file access is blocked in file:// mode. Run a local server or import the JSON manually.');
            return;
        }

        try {
            const response = await fetch(`${PROJECTS_PATH}?cache=${Date.now()}`);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data = await response.json();
            projects = Array.isArray(data) ? data : [];
            renderProjects();
            clearPendingChanges();
            showFeedback('success', 'Projects loaded from the site file.');
        } catch (error) {
            console.error('loadProjectsFromLocal', error);
            showFeedback('error', 'Failed to load the local projects file.');
        }
    }

    function importProjectsFromFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                const parsed = JSON.parse(text);
                projects = Array.isArray(parsed) ? parsed : [];
                renderProjects();
                markPendingChanges();
                showFeedback('success', 'Projects imported successfully.');
            } catch (error) {
                console.error('importProjectsFromFile', error);
                showFeedback('error', 'Invalid JSON file. Please provide a valid projects.json.');
            } finally {
                if (els.importJson) {
                    els.importJson.value = '';
                }
            }
        };
        reader.onerror = () => {
            showFeedback('error', 'Could not read the selected file.');
            if (els.importJson) {
                els.importJson.value = '';
            }
        };
        reader.readAsText(file, 'utf-8');
    }

    function showFileProtocolWarningIfNeeded() {
        if (location.protocol !== 'file:') return;
        const warning = document.getElementById('file-protocol-warning');
        if (warning) {
            warning.classList.remove('hidden');
        }
    }

    function markPendingChanges() {
        hasPendingChanges = true;
        updatePendingIndicator();
    }

    function clearPendingChanges() {
        hasPendingChanges = false;
        updatePendingIndicator();
    }

    function updatePendingIndicator() {
        if (!els.pendingIndicator) return;
        if (hasPendingChanges) {
            els.pendingIndicator.classList.remove('hidden');
        } else {
            els.pendingIndicator.classList.add('hidden');
        }
    }

    function generateProjectId(title) {
        const slug = title
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const base = slug || `project-${Date.now()}`;
        const exists = projects.some(project => project.id === base);
        return exists ? `${base}-${Date.now()}` : base;
    }
})();

