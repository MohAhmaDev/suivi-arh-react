import { Link as RouterLink, useMatches } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Link, Typography } from '@mui/material';
import { useBreadcrumbsRegistry } from '../../context/BreadcrumbsContext';

type BreadcrumbHandle =
  | string
  | {
      label?: string;
      dynamic?: boolean;
      hide?: boolean;
    };

type MatchHandle = {
  breadcrumb?: BreadcrumbHandle;
  hideBreadcrumbs?: boolean;
};

interface BreadcrumbItem {
  id: string;
  label: string;
  href: string;
}

export const Breadcrumbs = () => {
  const matches = useMatches();
  const { labels } = useBreadcrumbsRegistry();

  if (!matches.length) return null;

  const shouldHide = matches.some((match) => {
    const handle = match.handle as MatchHandle | undefined;
    return Boolean(handle?.hideBreadcrumbs);
  });

  if (shouldHide) return null;

  const crumbs = matches
    .map((match) => {
      const handle = match.handle as MatchHandle | undefined;
      if (!handle?.breadcrumb) return null;

      const config = handle.breadcrumb;
      if (typeof config === 'object' && config.hide) return null;

      let label: string | undefined;
      if (typeof config === 'string') {
        label = config;
      } else {
        label = config.label;
        if (config.dynamic && match.id) {
          label = labels[match.id] ?? label;
        }
      }

      if (!label) {
        const paramValues = Object.values(match.params ?? {});
        label = paramValues[paramValues.length - 1];
      }

      if (!label) return null;

      const href = match.pathname ?? '/';

      return {
        id: match.id ?? href,
        label,
        href,
      };
    })
    .filter((crumb): crumb is BreadcrumbItem => Boolean(crumb));

  if (crumbs.length <= 1) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="fil d'Ariane"
        sx={{ fontSize: 13 }}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          if (isLast) {
            return (
              <Typography key={crumb.id} color="text.primary" fontSize={13} fontWeight={600}>
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={crumb.id}
              component={RouterLink}
              to={crumb.href}
              underline="hover"
              color="text.secondary"
              fontSize={13}
              fontWeight={500}
            >
              {crumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
