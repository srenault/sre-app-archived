import React, {
  useState, useEffect, useCallback,
} from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import PauseIcon from '@material-ui/icons/Pause';

const STATE = {
  playing: 'playing',
  pause: 'pause',
  stop: 'stop',
};

export default function Current({
  apiClient, onStart, onStop, onPause,
}) {
  const [current, setCurrent] = useState(null);

  const [state, setState] = useState(STATE.stop);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {
        if (event.type === 'teleinfo_current') {
          setCurrent(event.value);
        }
      },
    });

    return () => subscription.unsubscribe();
  });

  const onPauseClick = useCallback(() => {
    setState(STATE.pause);
    if (onPause) onPause();
  }, []);

  const onStopClick = useCallback(() => {
    setState(STATE.stop);
    if (onStop) onStop();
  }, []);

  const onStartClick = useCallback(() => {
    setState(STATE.playing);
    if (onStart) onStart();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography align="center" variant="h6">Courant</Typography>
        <Typography align="center">{current ? `${current} A` : 'N/A'}</Typography>
      </CardContent>
      <CardActions>
        { state === STATE.playing && (
          <IconButton onClick={onPauseClick}>
            <PauseIcon />
          </IconButton>
        )}
        { (state === STATE.pause || state === STATE.stop) && (
          <IconButton onClick={onStartClick}>
            <PlayArrowIcon />
          </IconButton>
        )}
        <IconButton onClick={onStopClick} disabled={state === STATE.stop}>
          <StopIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
