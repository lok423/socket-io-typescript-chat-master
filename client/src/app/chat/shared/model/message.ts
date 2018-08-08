//import {User} from './user';
//import {Action} from './action';

export interface Message {
  toid : string,
  fromid: string,
	  msg : string,
	  senderName : string,
    //createAt: any,
    selfsockets: any,
    receiverName: string

  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}

export interface DrawImg {
  toid : string,
  fromid: string,
	  //msg : string,
	  senderName : string,
    //createAt: any,
    selfsockets: any,
    receiverName: string,
    drawImg:string
  /*
    from?: User;
    content?: any;
    action?: Action;
    createAt?: number;
    */
}
