import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import type { RecentActivity } from '../../types/stats';

interface ActivityFeedProps {
  activities: RecentActivity[];
  loading?: boolean;
}

const formatDate = (isoDate: string) => new Date(isoDate).toLocaleString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: 'short',
});

export const ActivityFeed = ({ activities, loading }: ActivityFeedProps) => (
  <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Activité récente
      </Typography>
      {loading && activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chargement...
        </Typography>
      ) : activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucune activité enregistrée.
        </Typography>
      ) : (
        <List disablePadding>
          {activities.map((activity) => (
            <ListItem key={activity.id} disableGutters sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main' }}>
                  <TimelineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {activity.user_username} · {activity.action}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {activity.objet_type} #{activity.objet_id} · {formatDate(activity.date_action)}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  </Paper>
);

export default ActivityFeed;
