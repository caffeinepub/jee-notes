import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Subject = {
    #physics;
    #chemistry;
    #maths;
  };

  public type Note = {
    id : Nat;
    title : Text;
    content : Text;
    subject : Subject;
    topic : Text;
    tags : [Text];
    bookmarked : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module Subject {
    public func compare(a : Subject, b : Subject) : Order.Order {
      switch (a, b) {
        case (#physics, #physics) { #equal };
        case (#chemistry, #chemistry) { #equal };
        case (#maths, #maths) { #equal };
        case (#physics, _) { #less };
        case (#chemistry, #maths) { #less };
        case (#chemistry, #physics) { #greater };
        case (#maths, _) { #greater };
      };
    };
  };

  module Note {
    public func compareByUpdatedAtDescending(a : Note, b : Note) : Order.Order {
      if (a.updatedAt > b.updatedAt) { #less } else if (a.updatedAt < b.updatedAt) {
        #greater;
      } else { #equal };
    };
  };

  let userNotes = Map.empty<Principal, Map.Map<Nat, Note>>();
  let recentNotes = Map.empty<Principal, List.List<Note>>();
  var noteIdCounter = 0;

  func getNextNoteId() : Nat {
    noteIdCounter += 1;
    noteIdCounter;
  };

  func getUserNotesMap(user : Principal) : Map.Map<Nat, Note> {
    switch (userNotes.get(user)) {
      case (?notes) { notes };
      case (null) {
        let notes = Map.empty<Nat, Note>();
        userNotes.add(user, notes);
        notes;
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createNote(title : Text, content : Text, subject : Subject, topic : Text, tags : [Text]) : async Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create notes");
    };
    if (content == "" or title == "" or topic == "") {
      Runtime.trap("Content must not be empty");
    };
    let id = getNextNoteId();
    let now = Time.now();
    let note : Note = {
      id;
      title;
      content;
      subject;
      topic;
      tags;
      bookmarked = false;
      createdAt = now;
      updatedAt = now;
    };
    let notes = getUserNotesMap(caller);
    notes.add(id, note);

    let currentRecentNotes = switch (recentNotes.get(caller)) {
      case (?recentList) { recentList };
      case (null) { List.empty<Note>() };
    };

    currentRecentNotes.add(note);
    if (currentRecentNotes.size() > 5) {
      let newRecentNotesArray = currentRecentNotes.toArray().sliceToArray(0, 5);
      currentRecentNotes.clear();
      currentRecentNotes.addAll(newRecentNotesArray.values());
    };

    recentNotes.add(caller, currentRecentNotes);
    note;
  };

  public query ({ caller }) func getNote(noteId : Nat) : async Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    switch (getUserNotesMap(caller).get(noteId)) {
      case (?note) { note };
      case (null) { Runtime.trap("Note not found") };
    };
  };

  public shared ({ caller }) func updateNote(noteId : Nat, title : Text, content : Text, subject : Subject, topic : Text, tags : [Text]) : async Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };
    if (content == "" or title == "" or topic == "") {
      Runtime.trap("Content must not be empty");
    };
    let notes = getUserNotesMap(caller);
    switch (notes.get(noteId)) {
      case (?existingNote) {
        let updatedNote : Note = {
          id = existingNote.id;
          title;
          content;
          subject;
          topic;
          tags;
          bookmarked = existingNote.bookmarked;
          createdAt = existingNote.createdAt;
          updatedAt = Time.now();
        };
        notes.add(noteId, updatedNote);

        let currentRecentNotes = switch (recentNotes.get(caller)) {
          case (?recentList) { recentList };
          case (null) { List.empty<Note>() };
        };

        let filteredRecentNotes = List.empty<Note>();
        currentRecentNotes.forEach(
          func(note) {
            if (note.id != noteId) {
              filteredRecentNotes.add(note);
            };
          }
        );
        filteredRecentNotes.add(updatedNote);

        if (filteredRecentNotes.size() > 5) {
          let newRecentNotesArray = filteredRecentNotes.toArray().sliceToArray(0, 5);
          filteredRecentNotes.clear();
          filteredRecentNotes.addAll(newRecentNotesArray.values());
        };

        recentNotes.add(caller, filteredRecentNotes);
        updatedNote;
      };
      case (null) { Runtime.trap("Note not found") };
    };
  };

  public shared ({ caller }) func deleteNote(noteId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };
    let notes = getUserNotesMap(caller);
    if (not notes.containsKey(noteId)) {
      Runtime.trap("Note not found");
    };
    notes.remove(noteId);

    switch (recentNotes.get(caller)) {
      case (?recentList) {
        let filteredRecentNotes = List.empty<Note>();
        recentList.forEach(
          func(note) {
            if (note.id != noteId) {
              filteredRecentNotes.add(note);
            };
          }
        );
        recentNotes.add(caller, filteredRecentNotes);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func searchNotes(keyword : Text) : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search notes");
    };
    let searchLower = keyword.toLower();
    let notes = getUserNotesMap(caller);
    let matchingNotes = List.empty<Note>();

    notes.values().forEach(
      func(note) {
        if (note.title.toLower().contains(#text searchLower) or note.content.toLower().contains(#text searchLower) or note.topic.toLower().contains(#text searchLower) or note.tags.any(func(tag) { tag.toLower().contains(#text searchLower) })) {
          matchingNotes.add(note);
        };
      }
    );

    matchingNotes.toArray();
  };

  public query ({ caller }) func filterBySubject(subject : Subject) : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter notes");
    };
    let notes = getUserNotesMap(caller);
    notes.values().toArray().filter(func(note) { note.subject == subject });
  };

  public query ({ caller }) func getBookmarkedNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access bookmarked notes");
    };
    let notes = getUserNotesMap(caller);
    notes.values().toArray().filter(func(note) { note.bookmarked });
  };

  public shared ({ caller }) func toggleBookmark(noteId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle bookmarks");
    };
    let notes = getUserNotesMap(caller);
    switch (notes.get(noteId)) {
      case (?note) {
        let updatedNote = { note with bookmarked = not note.bookmarked };
        notes.add(noteId, updatedNote);
        updatedNote.bookmarked;
      };
      case (null) { Runtime.trap("Note not found") };
    };
  };

  public query ({ caller }) func getTotalNoteCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access note statistics");
    };
    getUserNotesMap(caller).size();
  };

  public query ({ caller }) func getSubjectCount(subject : Subject) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access note statistics");
    };
    let notes = getUserNotesMap(caller);
    let filteredNotes = notes.values().toArray().filter(func(note) { note.subject == subject });
    filteredNotes.size();
  };

  public query ({ caller }) func getRecentlyAccessedNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access recent notes");
    };
    switch (recentNotes.get(caller)) {
      case (?notes) { notes.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    getUserNotesMap(caller).values().toArray();
  };

  public query ({ caller }) func getAllTags() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access tags");
    };
    let notes = getUserNotesMap(caller);
    let allTags = Set.empty<Text>();

    notes.values().forEach(
      func(note) {
        note.tags.forEach(
          func(tag) {
            allTags.add(tag);
          }
        );
      }
    );

    allTags.values().toArray();
  };
};
