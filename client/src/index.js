import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Websocket from 'react-websocket';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { config } from './config.js'


const wsHost = config.ws.host;
const wsPort = config.ws.port;
const wsApiEndpoint = 'testws';
const wsUrl = 'ws://' + wsHost + ':' + wsPort + '/api/' + wsApiEndpoint;

const panelInlineStyle = {
  backgroundColor: "#373737",
};
const cardInlineStyle = {
  backgroundColor: '#616161',
};
const gridInlineStyle = {
  width: '20%',
  padding: '1px',
  height: '12.5vh'
};
// });
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
  },
  media: {
  },
});


const srcColor = ['#FF3D00', '#66BB6A', '#fafafa'];
// function getRandom(arr, n) {
//     var result = new Array(n),
//         len = arr.length,
//         taken = new Array(len);
//     if (n > len)
//         throw new RangeError("getRandom: more elements taken than available");
//     while (n--) {
//         var x = Math.floor(Math.random() * len);
//         result[n] = arr[x in taken ? taken[x] : x];
//         taken[x] = --len in taken ? taken[len] : len;
//     }
//     return result;
// }

function SimpleMediaCard(props) {
  const { classes, content, storysrc, heat } = props;
  let color = srcColor[storysrc];
  let contentStyle = {
    "color": color,
    "whiteSpace": 'nowrap',
    "fontSize": '1.2em',
    "width": '70%',
    'textOverflow': 'ellipsis',
    'overflow': 'hidden',
  }
  let buttonStyle = {
    "color": color,
    "fontSize": "1.1em",
  }
  return (
    <div>
      <Card className={classes.card} style={cardInlineStyle}>
        <CardContent>
          <Typography component="p" style={contentStyle}>
            { content }
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" style={buttonStyle}>
            { heat }
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

function CenteredGrid(props) {
  const { classes, hotstories  } = props;
  const cardStyles = props.classes;
  const SimpleMediaCardStyled = withStyles(cardStyles)(SimpleMediaCard);
  var cards = []; 
  for (var i=0; i < hotstories.length; i++) {
    let heat = '';
    if (hotstories[i].heat > 0) {
      heat = hotstories[i].heat;
    }
    cards.push(
      <Grid item key={i} style={gridInlineStyle}>
        <SimpleMediaCardStyled 
          content={hotstories[i].content}
          storysrc={hotstories[i].src}
          heat={heat}
          >
        </SimpleMediaCardStyled>
      </Grid>
    );
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        {cards}
      </Grid>
    </div> 
  );
}


class HotstoryPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotstories: [],
    }
  }

  shuffle(arra1) {
    var ctr = arra1.length, temp, index;

  // While there are elements in the array
    while (ctr > 0) {
  // Pick a random index
        index = Math.floor(Math.random() * ctr);
  // Decrease ctr by 1
        ctr--;
  // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
  }

  handleData(data) {
    let hotstoryRecords = JSON.parse(data);
    if (hotstoryRecords.length > 0) {
      let newHotstories = hotstoryRecords.map(function(hotstoryRecord) {
        return {
          "hotstory_id": hotstoryRecord.hotstory_id,
          "content": hotstoryRecord.content,
          "heat": hotstoryRecord.heat,
          "src": hotstoryRecord.src,
        }
      });
      if (newHotstories.length > 0) {
        let updateHotstories = this.shuffle(newHotstories);
        // console.log("update stories");
        // console.log(updateHotstories);
        this.setState({"hotstories": updateHotstories});
      }
    }
  }


  render() {
    const CenteredGridSytled = withStyles(styles)(CenteredGrid);
    return (
      <div style={panelInlineStyle}>
        <div>
          <Websocket url={wsUrl}
              onMessage={this.handleData.bind(this)}/>
        </div>
        <CenteredGridSytled hotstories={this.state.hotstories}/>
      </div>
    );
  }
}

ReactDOM.render(
  <HotstoryPanel />,
  document.getElementById('root')
);