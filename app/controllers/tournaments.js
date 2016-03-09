'use strict';

var assign = require('object-assign');
var only = require('only');
var Tournament = require('../models/tournaments');

exports.load = function(req, res, next, id) {
  Tournament.findById(id, function(err, tournament) {
    if (err) next(err);

    req.tournament = tournament;
    if (!req.tournament) return next(new Error('Tournament not found'));
    next();
  });
}

exports.index = function(req, res) {
  Tournament.all(function(err, tournaments) {
    if (err) next(err);

    res.render('tournaments/index', {
      tournaments: tournaments
    });
  });
}

exports.new = function(req, res) {
  res.render('tournaments/new', {
    tournament: new Tournament()
  });
}

exports.create = function(req, res) {
  var tournament = new Tournament(only(req.body, Tournament.fields()));
  tournament.save(function(err) {
    if (err) next(err);
    else {
      res.redirect(tournament.getShowPath());
    }
  });
}

exports.show = function(req, res) {
  res.render('tournaments/show', {
    tournament: req.tournament
  });
}

exports.edit = function(req, res) {
  res.render('tournament/edit', {
    tournament: req.tournament
  });
}

exports.update = function(req, res) {
  var tournament = req.tournament;

  assign(tournament, only(req.body, Tournament.fields()));
  tournament.save();

  res.redirect(tournament.getShowPath());
}

exports.destroy = function(req, res) {
  req.tournament.remove();

  res.redirect('/tournaments');
}