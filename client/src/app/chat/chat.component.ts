import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';



import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';


const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {


  action = Action;
  user: User;
  //userId =1;
  //messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };



  socketId = null;
	selectedUser = null;
	messages = [];
	msgData = null;
	userList = [];
  username:string;
  selfsockets=[];
  allUsersList = [{channelid: '', userName: "mark",online:false},

{channelid: '',userName: "dean",online:false},

{channelid: '',userName: "peter",online:false},

{channelid: '',userName: "bill",online:false},

{channelid: '',userName: "mike",online:false},

{channelid: '',userName: "ken",online:false}];



  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(private socketService: SocketService,

    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.username= window.prompt('Enter Your Name');
    console.log(this.messages);
    //this.initModel();
    this.initIoConnection();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      //this.openUserPopup(this.defaultDialogUserParams);
    }, 0);

  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  selectUser(user){
    this.selectedUser=user;
    console.log(user);
  }

  private loadOnlineUser(allUsers,userList){
    for(var i=0;i<allUsers.length;i++){
      var found =false;
      for(var j=0;j<userList.length;j++){
        if(allUsers[i].userName==userList[j].userName){
          allUsers[i].channelid=userList[j].channelid;
          allUsers[i].online = true;
          found =true;
        }
      }
      if(found==false){
        allUsers[i].online =false;
        allUsers[i].channelid='';
      }
    }
  }


  private initIoConnection(): void {

    this.socketService.initSocket();
    this.socketService.init(this.username);
    console.log("emit ", this.username);
    this.ioConnection = this.socketService.socket.on('userList',(userList,channelid) => {
    	if(this.socketId === null){
    	    this.socketId = channelid;
    	}
    	this.userList = userList;
      this.getselfsockets();
      this.updateSelectedUser();
      this.loadOnlineUser(this.allUsersList,this.userList);

      //console.log(userList);
      console.log("userList",this.userList);
      console.log("socketId",this.socketId);
	});

  this.ioConnection = this.socketService.onMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
      console.log(message);
    });

  this.ioConnection = this.socketService.socket.on('exit', (userList) => {
		this.userList = userList;
    this.getselfsockets();
    this.updateSelectedUser();
    this.loadOnlineUser(this.allUsersList,this.userList);

	});




    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });


    this.ioConnection = this.socketService.onOldMessages()
      .subscribe((message: any) => {
        for(var i=0;i<message.length;i++){
          this.messages.push(message[i]);
        }
        console.log("messages history:" ,this.messages);
      });




    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });

  }
  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
          fromid: this.socketId,
	        	toid : this.selectedUser.channelid,
	    		msg : message,
	    		senderName : this.username,
          receiverName : this.selectedUser.userName,
          //createAt: Date.now(),
          selfsockets: this.selfsockets
    });


    this.messageContent = null;
  }

  getselfsockets(){
    for(var i =0; i<this.userList.length;i++){
      if(this.userList[i].userName==this.username){
        this.selfsockets =this.userList[i].channelid;
      }
    }
    console.log("selfsockets",this.selfsockets);

  }

  updateSelectedUser(){
    if(this.selectedUser){
      for(var i =0; i<this.userList.length;i++){
        if(this.userList[i].userName==this.selectedUser.userName){
          this.selectedUser =this.userList[i];
        }
      }
    }
    console.log("selecteduser", this.selectedUser);
  }

  arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}



  /*

  private initModel(): void {
    const userId = this.getRandomId();
    this.user = {
      id: userId,
      avatar: `${AVATAR_URL}/${userId}.png`
    };
  }


  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  convertToDate(number){
    var date = new Date(number);
    return date.toString();
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }



  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      this.user.role = paramsDialog.role;
      if (this.user.role=="tutor"){
         this.user.id = 1;
      }else if (this.user.role=="student"){
         this.user.id  = 2;
      }
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }


  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.socketService.send({
      from: this.user,
      createAt: Date.now(),
      action:3
    });

    this.socketService.send({
      from: this.user,
      content: message,
      createAt: Date.now()
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action,

      }
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(message);
  }
  */
}
