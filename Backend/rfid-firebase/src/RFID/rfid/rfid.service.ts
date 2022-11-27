import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin } from 'nestjs-firebase/lib/firebase.decorator';
import { FirebaseAdmin } from 'nestjs-firebase/lib/firebase.interface';
import { Subject } from 'rxjs';

@Injectable()
export class RfidService {
    date = new Date()
    $rfid = new Subject();

    constructor(@InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin) {
        this.getAllLog();
        //this.$rfid.subscribe((data: any) => this.addLog(data.message))
    }
    
    async addLog(data: any) {
        await this.firebase.db.collection('datalog').doc().set(data);
    }

    async getAllLog() {
        let datalog = await this.firebase.db.collection('datalog').get();
        datalog.forEach(doc => this.$rfid.next(doc.data())); 
    }

    async getAllRFID() {
        let data = await this.firebase.db.collection('rfid').get();
        let rfids = [];
        if(data.empty) {
            return "No RFID";
        }
        else {
            data.forEach(doc => {
                rfids.push({id: doc.id, data: doc.data()})
            })
        }
        return rfids;
    }

    async postRFID(rfid: any) {
        return await this.firebase.db.collection('rfid').doc().set(rfid);
    }

    async updateByRFID(rfid: any) {
        let data = await this.firebase.db.collection('rfid').get();
        let rfids = [];
        data.forEach(doc => {
            const tempDoc = doc.data();
            if(tempDoc.rfid == rfid) {
                this.date = new Date();
                let pushData = {
                    id: doc.id,
                    data: {
                        ...tempDoc, 
                        status: tempDoc.status === "active" ? "inactive" : "active",
                        lastCheck: this.date.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})
                    }
                }
                this.updateStatus(pushData);
                this.$rfid.next(pushData);
                rfids.push(pushData);
            }
        })
        return rfids;
    }

    async updateStatus(body: any) {
        try {
            return await this.firebase.db.collection('rfid').doc(body.id).update(body.data);
        } catch (error) {
            return error;
        }
    }

    async realtimeData() {
        return this.$rfid.asObservable();
    }
}
