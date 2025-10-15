import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';


interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  postalCode: string;
  province: string;
  district: string;
  subDistrict: string;
  bio: string;
}

@Component({ 
  selector: 'app-user',
  standalone: true, 
  imports: [ 
    CommonModule,
    FormsModule, 
    Card,        
    Button,      
    InputText,   
    InputTextarea,
   
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent implements OnInit { 
  user: User = {
    firstName: 'สมชาย',   
    lastName: 'ใจดี',
    email: 'somchai.jaidee@example.com',
    phoneNumber: '081-234-5678',
    addressLine1: '99/9 หมู่ 9',
    postalCode: '10110',
    province: 'กรุงเทพมหานคร',
    district: 'วัฒนา',
    subDistrict: 'คลองตันเหนือ',
    bio: 'นักลงทุนอิสระและผู้ชื่นชอบเทคโนโลยีทางการเงิน'
  };

  isEditing: boolean = false;
  editableUser: User = { ...this.user };

  constructor() { }

  ngOnInit(): void {
    console.log('UserComponent initialized.');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editableUser = { ...this.user };
    }
  }

  saveChanges(): void {
    console.log('บันทึกข้อมูลผู้ใช้:', this.editableUser);
    this.user = { ...this.editableUser };
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}
