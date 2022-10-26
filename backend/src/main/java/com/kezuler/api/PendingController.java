package com.kezuler.api;

import com.kezuler.common.ResponseSet;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.dto.EventDto;
import com.kezuler.service.EventService;
import com.kezuler.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/pendingEvents")
@RequiredArgsConstructor
public class PendingController {

    private final EventService eventService;
    private final MessageService messageService;

    // 해당 유저가 속한 전체 리스트
    @GetMapping
    public ResponseEntity<ResponseSet> getEvents(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                 @RequestParam(value = "page", defaultValue = "0") int page) {

        PageRequest pageRequest = PageRequest.of(page, 15);
        List<EventDto.GetPending> pendings = eventService.getPendings(userDetails, pageRequest);
        ResponseSet responseSet = new ResponseSet(pendings);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 이벤트 단일
    @GetMapping("/{eventId}")
    public ResponseEntity<ResponseSet> getEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                @PathVariable String eventId) {

        EventDto.GetPending singlePending = eventService.getPending(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet(singlePending);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }


    // 새로운 event 생성
    @PostMapping
    public ResponseEntity<ResponseSet> newEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                @RequestBody @Valid EventDto.Post eventDto) {
        log.info(" Enter -> [ PendingController @Post /pendingEvents ] {}", userDetails.getAccount().getName());
        log.info("  eventTitle : {}", eventDto.getEventTitle());
        log.info(" eventDescription : {}", eventDto.getEventDescription());
        log.info(" eventTimeDuration : {}", eventDto.getEventTimeDuration());
        log.info(" eventTimeCandidates : {}", eventDto.getEventTimeCandidates());
        log.info(" addressType : {}", eventDto.getAddressType());
        log.info(" addressDetail : {}", eventDto.getAddressDetail());
        log.info(" eventAttachment : {}", eventDto.getEventAttachment());

        // 이벤트 생성
        EventDto.GetPending event = eventService.createEvent(userDetails, eventDto);

        ResponseSet responseSet = new ResponseSet(event);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // event 정보 수정
    @PatchMapping("/{eventId}")
    public ResponseEntity<ResponseSet> updateEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                   @PathVariable String eventId,
                                                   @RequestBody(required = false) @Valid EventDto.Update eventDto) {
        log.info(" Enter -> [ PendingController @Patch /pendingEvents/{eventId} ] {}", userDetails.getAccount().getName());
        ResponseSet responseSet = null;

        log.info("  eventTitle : {}", eventDto.getEventTitle());
        log.info("  addressType : {}", eventDto.getAddressType());
        log.info("  addressDetail : {}", eventDto.getAddressDetail());
        log.info("  eventAttachment : {}", eventDto.getEventAttachment());

        eventDto.setEventId(eventId);
        EventDto.GetPending getPending = eventService.updatePendingEvent(userDetails, eventDto);
        responseSet = new ResponseSet(getPending);

        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }


    @GetMapping("/invitation/{eventId}")
    public ResponseEntity<ResponseSet> inviteGuest(@PathVariable String eventId) {
        log.info(" Enter -> [ PendingController @GET /invitation/{eventId} ] {}", eventId);

        EventDto.GetPending singlePending = eventService.getInvitationEvent(eventId);
        ResponseSet responseSet = new ResponseSet(singlePending);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @PutMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> insertGuestSelectTime(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                             @PathVariable String eventId,
                                                             @RequestBody EventDto.VoteTime eventDto) {
        log.info(" Enter -> [ PendingController @Put /pendingEvents/{eventId}/candidate ] {}", eventId);
        EventDto.GetPending getPending = eventService.invitedGuestAccept(userDetails, eventId, eventDto.getAddTimeCandidates());
        ResponseSet responseSet = new ResponseSet(getPending);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> insertGuestDecline(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                          @PathVariable String eventId,
                                                          @RequestBody EventDto.DeclineReason eventDto) {
        log.info(" Enter -> [ PendingController @Delete /pendingEvents/{eventId}/candidate ] {}", eventId);
        log.info(" Enter -> [ PendingController @Delete /pendingEvents/{eventId}/candidate ] reason  : {}", eventDto.getUserDeclineReason());
        EventDto.GetPending getPending = eventService.invitedGuestDecline(userDetails, eventId, eventDto);
        ResponseSet responseSet = new ResponseSet(getPending);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @PatchMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> cancelEventByGuest(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                             @PathVariable String eventId) {
        log.info(" Enter -> [ PendingController @Patch /pendingEvents/{eventId}/candidate ] {}", eventId);
        eventService.cancelPendingEventByGuest(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }



    @PatchMapping("/{eventId}/host")
    public ResponseEntity<ResponseSet> cancelEventByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                         @PathVariable String eventId){
        log.info(" Enter -> [ EventController @Patch /events/host/{eventId} ] {}", eventId);

        eventService.cancelPendingEventByHost(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}/host")
    public ResponseEntity<ResponseSet> deleteEventByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                         @PathVariable String eventId){
        log.info(" Enter -> [ EventController @DELETE /events/host/{eventId} ] {}", eventId);

        eventService.deletePendingEventByHost(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }
}
