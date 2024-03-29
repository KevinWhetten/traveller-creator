﻿import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoggingService} from "../../../../services/metadata-services/logging.service";
import {CharacterService} from "../../../../services/character.service";

@Component({
  selector: 'app-event-recognition',
  templateUrl: './event-recognition.component.html',
  styleUrls: ['./event-recognition.component.css']
})
export class EventRecognitionComponent implements OnInit {
  @Output() graduate = new EventEmitter();

  constructor(private _characterService: CharacterService,
              private _loggingService: LoggingService) {
  }

  ngOnInit(): void {
    if (this._loggingService.getLastLog() != 'I gained wide-ranging recognition of my initiative and innovative approach to study.') {
      this._loggingService.addLog('I gained wide-ranging recognition of my initiative and innovative approach to study.');
    }
  }

  recognized() {
    this._characterService.increaseSocialStatus(1);
    this.graduate.emit();
  }
}
