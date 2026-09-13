export const slugifyProject = (value = '') => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const getProjectPath = (project = {}) =>
  `/projects/${project.slug || slugifyProject(project.title || project.id || 'project')}`;
