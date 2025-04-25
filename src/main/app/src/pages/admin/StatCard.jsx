import { memo } from 'react';
import { CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { StatCard } from '../theme/theme';

const StatCardComponent = memo(({ title, value, icon, color, subtext }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <StatCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color, fontWeight: 600 }}>
            {title}
          </Typography>
          <Box sx={{ bgcolor: `${color}10`, p: 1.5, borderRadius: '50%' }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtext}
        </Typography>
      </CardContent>
    </StatCard>
  </motion.div>
));

export default StatCardComponent;