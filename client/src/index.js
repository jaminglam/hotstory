import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Websocket from 'react-websocket';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import config from './config';

// const cardMediaStyle = theme => ({
//   root: {},
const cardMediaInlineStyle = {
  backgroundSize: 'contain',
  padding: '50px',
}
// });
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    maxWidth: 280,
  },
  media: {
  },
});

const logoUrlList = ['/test/twitter.png',
  '/test/weibo.png', '/test/google.png'];
const srcList = ['Twitter', 'Weibo', 'Google'];
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function SimpleMediaCard(props) {
  const { classes, content, storysrc } = props;
  let logoUrl = logoUrlList[storysrc];
  let srctitle = srcList[storysrc];
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={logoUrl}
          title={srctitle}
          style={cardMediaInlineStyle}
        />
        <CardContent>
          <Typography component="p">
            { content }
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
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
  console.log("CenteredGrid hotstories: ");
  console.log(hotstories);
  console.log("CenteredGrid hotstory num: " + hotstories.length);
  for (var i=0; i < hotstories.length; i++) {
    cards.push(
      <Grid item xs={4} key={i}>
        <SimpleMediaCardStyled 
          content={hotstories[i].content}
          storysrc={hotstories[i].src}>
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

  handleData(data) {
    let cardNum = config.num;
    const hotstories = this.state.hotstories.slice();
    console.log("hotstories: ");
    console.log(hotstories);
    console.log("received data: " + data);
    let hotstoryRecords = JSON.parse(data);
    let newHotstories = hotstoryRecords.map(function(hotstoryRecord) {
      return {
        "hotstory_id": hotstoryRecord.hotstory_id,
        "content": hotstoryRecord.content,
        "heat": hotstoryRecord.heat,
        "src": hotstoryRecord.src,
      }
    });
    console.log("newHotstories: ");
    console.log(newHotstories);
    if (hotstories === undefined || hotstories.length < cardNum) {
      console.log("init hotstories");
      let initHotstories = newHotstories.slice(0, cardNum); 
      console.log(initHotstories);
      this.setState({"hotstories": initHotstories});
    } else if (hotstories.length >= cardNum) {
      console.log("update hotstories");
      let hotstoriesIds = hotstories.map((hotstory) => hotstory.hotstory_id);
      console.log("hotstoriesIds: ");
      console.log(hotstoriesIds);
      let diffHotstories = newHotstories.filter((hotstory) => 
        !hotstoriesIds.includes(hotstory.hotstory_id));
      // let hotstoriesIdSet = new JS.Set(hotstoriesIds);
      // let newHotstoriesIdSet = new JS.Set(newHotstoriesIds);
      // let diffHotstoryIds = Array.from(
      //   hotstoriesIdSet.difference(newHotstoriesIdSet));
      // let diffHotstories = newHotstories.filter(
      //   (hotstory) => diffHotstoryIds.includes(hotstory.hotstory_id));
      let updateStories = diffHotstories; 
      console.log("update stories: ");
      console.log(updateStories);
      // randoomly update postition
      let updateStoryNum = diffHotstories.length;
      console.log("update story num: " + updateStoryNum);
      let fullIdx = Array.from(Array(cardNum).keys());
      let updateIdx = getRandom(fullIdx, updateStoryNum);
      console.log("update idx: ");
      console.log(updateIdx);

      updateIdx.forEach(function(idx, i) {
        hotstories[idx] = updateStories[i];
      });
      console.log("updated stories: ");
      console.log(hotstories);
      this.setState({"hotstories": hotstories});
    }
  

  }


  render() {
    const CenteredGridSytled = withStyles(styles)(CenteredGrid);
    return (
      <div>
        <div>
          <Websocket url='ws://localhost:5000/api/testws'
              onMessage={this.handleData.bind(this)}/>
        </div>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Hotstory</h1>
          </header>
          <p className="App-intro">
           To get started, edit <code>src/App.js</code> and save to reload.
          </p>
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