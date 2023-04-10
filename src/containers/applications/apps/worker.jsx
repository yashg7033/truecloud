import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import { dispatchAction, handleFileOpenWorker } from "../../../actions";
import "./assets/fileexpo.scss";
import fdata2 from '../../../reducers/dir.json'
const NavTitle = (props) => {
  var src = props.icon || "folder";

  return (
    <div
      className="navtitle flex prtclk"
      data-action={props.action}
      data-payload={props.payload}
      onClick={dispatchAction}
    >
      <Icon
        className="mr-1"
        src={"win/" + src + "-sm"}
        width={props.isize || 16}
      />
      <span>{props.title}</span>
    </div>
  );
};

const FolderDrop = ({ dir }) => {
  const files = useSelector((state) => state.files);
  const folder = files.data.getId(dir);

  return (
    <>
      {folder.data &&
        folder.data.map((item, i) => {
          if (item.type == "folder") {
            return (
              <Dropdown
                key={i}
                icon={item.info && item.info.icon}
                title={item.name}
                notoggle={item.data.length == 0}
                dir={item.id}
              />
            );
          }
        })}
    </>
  );
};

const Dropdown = (props) => {
  const [open, setOpen] = useState(props.isDropped != null);
  const special = useSelector((state) => state.worker.data.special);
  const [fid, setFID] = useState(() => {
    if (props.spid) return special[props.spid];
    else return props.dir;
  });
  const toggle = () => setOpen(!open);

  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle ? (
          <Icon
            className="arrUi"
            fafa={open ? "faChevronDown" : "faChevronRight"}
            width={10}
            onClick={toggle}
            pr
          />
        ) : (
          <Icon className="arrUi opacity-0" fafa="faCircle" width={10} />
        )}
        <NavTitle
          icon={props.icon}
          title={props.title}
          isize={props.isize}
          action={props.action != "" ? props.action || "FILEDIRWORKER" : null}
          payload={fid}
        />
        {props.pinned != null ? (
          <Icon className="pinUi" src="win/pinned" width={16} />
        ) : null}
      </div>
      {!props.notoggle ? (
        <div className="dropcontent">
          {open ? props.children : null}
          {open && fid != null ? <FolderDrop dir={fid} /> : null}
        </div>
      ) : null}
    </div>
  );
};

const fdata = fdata2

//{
//	"backup": {
//		"type": "folder",
//		"name": "backup",
//		"info": {
//			"size": "104000000000",
//			"used": "90000000000",
//			"spid": "%worker%"
//		},
//		"data": {
//			"config": {
//				"type": "folder",
//				"name": "config",
//				"info": {
//					"spid": "%config%"
//				},
//				"data": {
//					"update": {
//						"type": "file",
//						"name": "update"
//					},
//					"update2": {
//						"type": "folder",
//						"name": "update2"
//					}
//				}
//			},
//			"config2": {
//				"type": "folder",
//				"name": "config2"
//			},
//			"config4": {
//				"type": "folder",
//				"name": "config4"
//			}
//		}
//	},
//}
export const Worker = () => {
  const wnapp = useSelector((state) => state.apps.worker);
  const files = useSelector((state) => state.worker);
  const fdata = files.data.getId(files.cdir);
  const [cpath, setPath] = useState(files.cpath);
  const [searchtxt, setShText] = useState("");
  const dispatch = useDispatch();
  
  const handleChange = (e) => setPath(e.target.value);
  const handleSearchChange = (e) => setShText(e.target.value);
  React.useEffect(()=>{
	dispatch({type: 'FILEUPDATEWORKER', payload: fdata})
  }, [])
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "FILEPATHWORKER", payload: cpath });
    }
  };

  const DirCont = () => {
    var arr = [],
      curr = fdata,
      index = 0;
    while (curr) {
      arr.push(
        <div key={index++} className="dirCont flex items-center">
          <div
            className="dncont"
            onClick={dispatchAction}
            tabIndex="-1"
            data-action="FILEDIRWORKER"
            data-payload={curr.id}
          >
            {curr.name}
          </div>
          <Icon className="dirchev" fafa="faChevronRight" width={8} />
        </div>
      );

      curr = curr.host;
    }

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <div className="dncont" tabIndex="-1">
          Worker
        </div>
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>
    );

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <Icon
          className="pr-1 pb-px"
          src={"win/" + fdata.info.icon + "-sm"}
          width={16}
        />
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>
    );

    return (
      <div key={index++} className="dirfbox h-full flex">
        {arr.reverse()}
      </div>
    );
  };

  useEffect(() => {
    setPath(files.cpath);
    setShText("");
  }, [files.cpath]);

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
      />
      <div className="windowScreen flex flex-col">
        <Ribbon />
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon
              className={
                "navIcon hvtheme" + (files.hid == 0 ? " disableIt" : "")
              }
              fafa="faArrowLeft"
              width={14}
              click="FILEPREVWORKER"
              pr
            />
            <Icon
              className={
                "navIcon hvtheme" +
                (files.hid + 1 == files.hist.length ? " disableIt" : "")
              }
              fafa="faArrowRight"
              width={14}
              click="FILENEXTWORKER"
              pr
            />
            <Icon
              className="navIcon hvtheme"
              fafa="faArrowUp"
              width={14}
              click="FILEBACKWORKER"
              pr
            />
            <div className="path-bar noscroll" tabIndex="-1">
              <input
                className="path-field"
                type="text"
                value={cpath}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <DirCont />
            </div>
            <div className="srchbar">
              <Icon className="searchIcon" src="search" width={12} />
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchtxt}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="sec2">
            <NavPane />
            <ContentArea searchtxt={searchtxt} />
          </div>
          <div className="sec3">
            <div className="item-count text-xs">{fdata?.data?.length} items</div>
            <div className="view-opts flex">
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEWWORKER"
                payload="5"
                open={files.view == 5}
                src="win/viewinfo"
                width={16}
              />
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEWWORKER"
                payload="1"
                open={files.view == 1}
                src="win/viewlarge"
                width={16}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentArea = ({ searchtxt }) => {
  const files = useSelector((state) => state.worker);
  const special = useSelector((state) => state.worker.data.special);
  const [selected, setSelect] = useState(null);
  const [subInfo, setSubInfo] = useState({})
  React.useEffect(()=>{
	const res = files.data.getId(selected);
	debugger
	setSubInfo(res)
  }, [ selected])
  const fdata = files.data.getId(files.cdir);
  const dispatch = useDispatch();

  const fetchData = async () =>{
	const res = await fetch('https://jsonplaceholder.typicode.com/users')
	const resParse = await res.json()
	return resParse
  }
 
  const handleClick = (e) => {
    e.stopPropagation();
    setSelect(e.target.dataset.id);
  };

  const handleDouble = (e) => {
    e.stopPropagation();
    handleFileOpenWorker(e.target.dataset.id);
  };

  const emptyClick = (e) => {
    setSelect(null);
  };

  const handleKey = (e) => {
    if (e.key == "Backspace") {
      dispatch({ type: "FILEPREVWORKER" });
    }
  };

  return (
    <div
      className="contentarea"
      onClick={emptyClick}
      onKeyDown={handleKey}
      tabIndex="-1"
    >
      <div className="contentwrap win11Scroll">
        <div className="gridshow" data-size="lg">
          {fdata.data.map((item, i) => {
            return (
              item.name.includes(searchtxt) && (
                <div
                  key={i}
                  className="!p-4 conticon hvtheme flex flex-col items-center prtclk"
                  data-id={item.id}
                  data-focus={selected == item.id}
                  onClick={handleClick}
                  onDoubleClick={handleDouble}
                >
                  <Image src={`icon/win/${item.info.icon}`} />
                  <span>{item.name}</span>
                </div>
              )
            );
          })}
        </div>
        {fdata?.data?.length == 0 ? (
          <span className="text-xs mx-auto">This folder is empty.</span>
        ) : null}
      </div>
	  <div
	  	className="subinfo"
	  >
		{
			subInfo?.info?.spid ?? fdata?.subInfo?.spid
		}

	  </div>
    </div>
  );
};

const NavPane = ({}) => {
  const files = useSelector((state) => state.worker);
  const special = useSelector((state) => state.worker.data.special);

  return (
    <div className="navpane win11Scroll">
      <div className="extcont">
        <Dropdown icon="thispc" title="Worker" action="" isDropped>
			{
				//special?.map((item, index)=>(
				//	<Dropdown icon="folder" title="" spid="%worker%"/>
				//))
			}
          <Dropdown icon="folder" title="Workder" spid="%worker%" />
        </Dropdown>
      </div>
    </div>
  );
};

const Ribbon = ({}) => {
  return (
    <div className="msribbon flex">
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="new" ui width={18} margin="0 6px" />
          <span>New</span>
        </div>
      </div>
      <div className="ribsec">
        <Icon src="cut" ui width={18} margin="0 6px" />
        <Icon src="copy" ui width={18} margin="0 6px" />
        <Icon src="paste" ui width={18} margin="0 6px" />
        <Icon src="rename" ui width={18} margin="0 6px" />
        <Icon src="share" ui width={18} margin="0 6px" />
      </div>
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="sort" ui width={18} margin="0 6px" />
          <span>Sort</span>
        </div>
        <div className="drdwcont flex">
          <Icon src="view" ui width={18} margin="0 6px" />
          <span>View</span>
        </div>
      </div>
    </div>
  );
};
